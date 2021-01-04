import {Dispatch} from 'redux'
import {todolistsAPI, TodolistServerType} from '../../api/api'
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

//reducer
const initialState: Array<TodolistBusinessType> = []

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        //we can use mutable methods here
        setTodolistsAC(state, action: PayloadAction<{todolists: Array<TodolistServerType>}>){
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        removeTodolistAC(state, action: PayloadAction<{todolistId: string}>){
            /*const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if(index !== -1) {
                state.splice(index, 1)
            }*/
            return state.filter(tl => tl.id !== action.payload.todolistId)
        },
        addTodolistAC(state, action: PayloadAction<{todolist: TodolistServerType}>){
            //добавляем в серверный тудулист фильтр
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodoListTitleAC(state, action: PayloadAction<{todolistId: string, title: string}>){
            //searching tdlist we need
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.title
        },
        changeTodoListFilterAC(state, action: PayloadAction<{todolistId: string, filter: FilterValuesType}>){
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].filter = action.payload.filter
        },
        //status for disabling buttons (while requesting server)
        changeTodolistEntityStatusAC(state, action: PayloadAction<{todolistId: string, entityStatus: RequestStatusType}>){
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.entityStatus
        }
    }
})

export const todolistsReducer = slice.reducer
//actions
export const {removeTodolistAC, addTodolistAC, changeTodoListTitleAC,
    changeTodoListFilterAC, setTodolistsAC, changeTodolistEntityStatusAC} = slice.actions

//thunks
export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    //крутилку ставим перед запросом на серв
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.getTodolists()
      //после ответа
      .then(res => {
          dispatch(setTodolistsAC({todolists: res}))
          //тд подгрузились, крутилку убираем
          dispatch(setAppStatusAC({status: 'succeeded'}))
      }).catch((error) => handleServerNetworkError(error, dispatch))

}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    //disable delete button for the TL to be deleted
    dispatch(changeTodolistEntityStatusAC({todolistId, entityStatus: 'loading'}))
    //preloader
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.deleteTodolist(todolistId)
      //после ответа
      .then(res => {
            if (res.resultCode === 0) {
                dispatch(removeTodolistAC({todolistId}))
                //preloader cancel
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res, dispatch)
            }
        }
      ).catch((error) => handleServerNetworkError(error, dispatch))
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    //preloader
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.createTodolist(title)
      //получаем с сервера
      .then(res => {
          if (res.resultCode === 0) {
              dispatch(addTodolistAC({todolist: res.data.item}))
              //preloader cancel
              dispatch(setAppStatusAC({status: 'succeeded'}))
          } else {
              handleServerAppError(res, dispatch)
          }
      }).catch((error) => handleServerNetworkError(error, dispatch))
}
export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    //preloader
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.updateTodolist(todolistId, title)
      //получаем с UI
      .then(res => {
          if (res.resultCode === 0) {
              dispatch(changeTodoListTitleAC({todolistId, title}))
              //preloader cancel
              dispatch(setAppStatusAC({status: 'succeeded'}))
          } else {
              if (res.messages.length) {
                  dispatch(setAppErrorAC({error: res.messages[0]}))
              } else {
                  dispatch(setAppErrorAC({error: 'Some error occurred'}))
              }
              dispatch(setAppStatusAC({status: 'failed'}))
          }
      }).catch(error => handleServerNetworkError(error, dispatch))
}

// types
export type AddTodoListActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodoListActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>

export type FilterValuesType = 'all' | 'active' | 'completed';
//дополняем тип, приходящий с сервера тем, что нужно UI
export type TodolistBusinessType = TodolistServerType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}