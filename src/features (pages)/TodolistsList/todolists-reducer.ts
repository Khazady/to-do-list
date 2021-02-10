import {todolistsAPI, TodolistServerType} from '../../api/api'
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'

//thunks
export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (arg, {dispatch, rejectWithValue}) => {
    //крутилку ставим перед запросом на серв
    dispatch(setAppStatusAC({status: 'loading'}))
    const data = await todolistsAPI.getTodolists()
    try {
        //тд подгрузились, крутилку убираем
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolists: data}
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }

})
export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {dispatch, rejectWithValue}) => {
    //disable delete button for the TL to be deleted
    dispatch(changeTodolistEntityStatusAC({todolistId, entityStatus: 'loading'}))
    //preloader
    dispatch(setAppStatusAC({status: 'loading'}))
    const data = await todolistsAPI.deleteTodolist(todolistId)
    try {
        if (data.resultCode === 0) {
            //preloader cancel
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolistId}
        } else {
            handleServerAppError(data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, {dispatch, rejectWithValue}) => {
    //preloader
    dispatch(setAppStatusAC({status: 'loading'}))
    const data = await todolistsAPI.createTodolist(title)
    try {
        if (data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolist: data.data.item}
        } else {
            handleServerAppError(data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolist', async (arg: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
    //preloader
    dispatch(setAppStatusAC({status: 'loading'}))
    const data = await todolistsAPI.updateTodolist(arg.todolistId, arg.title)
    try {
        if (data.resultCode === 0) {
            //preloader cancel
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolistId: arg.todolistId, title: arg.title}
        } else {
            if (data.messages.length) {
                dispatch(setAppErrorAC({error: data.messages[0]}))
            } else {
                dispatch(setAppErrorAC({error: 'Some error occurred'}))
            }
            dispatch(setAppStatusAC({status: 'failed'}))
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistBusinessType>,
    reducers: {
        //we can use mutable methods
        changeTodoListFilterAC(state, action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.filter
        },
        //status for disabling buttons (while requesting server)
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.entityStatus
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            /*const index = state.findIndex(tl => tl.id === action.payload.todolistId)
                        if(index !== -1) {
                            state.splice(index, 1)
                        }*/
            return state.filter(tl => tl.id !== action.payload.todolistId)
        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            //добавляем в серверный тудулист фильтр
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        })
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            //searching tdlist we need
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.title
        })
    }
})

//exports from slice
export const todolistsReducer = slice.reducer
export const {changeTodoListFilterAC, changeTodolistEntityStatusAC} = slice.actions

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
//дополняем тип, приходящий с сервера тем, что нужно UI
export type TodolistBusinessType = TodolistServerType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}