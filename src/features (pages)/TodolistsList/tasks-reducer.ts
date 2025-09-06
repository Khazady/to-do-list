import {addTodolistTC, fetchTodolistsTC, removeTodolistTC} from './todolists-reducer'
import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, UpdateTaskModelType} from '../../api/api'
import {RootStateType} from '../../app/store'
import {setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'


//thunks
export const deleteTaskTC = createAsyncThunk('tasks/deleteTask', async (arg: { todolistId: string, taskId: string }, thunkAPI) => {
    // show preloader before server request
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const data = await tasksAPI.deleteTask(arg.todolistId, arg.taskId)
    try {
        // only then dispatch change to our state
        if (data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            // return a promise (since async func) resolving with needed object
            return {todolistId: arg.todolistId, taskId: arg.taskId}
        } else {
            handleServerAppError(data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})
export const fetchTasksTC = createAsyncThunk('tasks/fetchTask', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const data = await tasksAPI.getTasks(todolistId)
    const tasks = data.items
    //preloader cancel
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    //instead of dispatching AC(data), we just return needed in case data
    return {tasks, todolistId}
})
export const addTaskTC = createAsyncThunk('tasks/addTask', async (arg: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
    // preloader
    dispatch(setAppStatusAC({status: 'loading'}))
    const data = await tasksAPI.createTask(arg.todolistId, arg.title)

    try {
        if (data.resultCode === 0) {
            const task = data.data.item
            // preloader cancel
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return task
        } else {
            handleServerAppError(data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        // error itself not important; just notify redux-toolkit
        return rejectWithValue(null)
    }
})
export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (arg: { todolistId: string, taskId: string, model: UpdateBusinessTaskModelType },
                                                                        {dispatch, rejectWithValue, getState}) => {
    // preloader
    dispatch(setAppStatusAC({status: 'loading'}))
    const state = getState() as RootStateType
    // find desired task
    const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
    // in case an unexpected error occurs
    if (!task) {
        return rejectWithValue('task was not found in the state')
    }
    // change only the status; take rest from getState
    const serverModal: UpdateTaskModelType = {
        // don't copy using {...task, status} because task contains extra data
        // unneeded by server (todoId, addedDate, id)
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        status: task.status,
        title: task.title,
        // here there will be a property to overwrite; it will replace in serverModel
        ...arg.model
    }
    const data = await tasksAPI.updateTask(arg.todolistId, arg.taskId, serverModal)
    try {
        if (data.resultCode === 0) {
            // preloader cancel
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return arg
        } else {
            handleServerAppError(data, dispatch)
            // we handle errors our way but must reject to keep redux-toolkit infrastructure, otherwise it goes to fulfilled
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})


const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {},
    // cases used in multiple reducers
    // when changing lists, also change second part of state responsible for their tasks
    // syntax for auto typing
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            // adding new list, create empty array for its tasks
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            delete state[action.payload.todolistId]
        })
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            // when lists come from API, create empty array for each list's tasks
            action.payload.todolists.forEach(tl => state[tl.id] = [])
        })
        // instead of explicitly created AC, take it from TC (when thunk resolves, like promise fulfilled)
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            // find needed list in associative array by id and put tasks from action into it
            state[action.payload.todolistId] = action.payload.tasks
        })
        builder.addCase(deleteTaskTC.fulfilled, (state, action) => {
            // find required tasks array by id
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => {
                return t.id === action.payload.taskId
            })
            // check found it just in case
            if (index > -1) {
                // remove one element starting from needed index
                tasks.splice(index, 1)
            }
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            // find by id in associative array and add task from action to the start
            state[action.payload.todoListId].unshift(action.payload)
        })
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            // check found it just in case
            if (index > -1) {
                // replace task with a copy modified by action model (contains the property that changed)
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        })
    }
})


//exports from slice
export const tasksReducer = slice.reducer


// types
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
// type needed to make one TC for several task update operations so we don't send everything at once
export type UpdateBusinessTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string | null
    deadline?: string | null
}
