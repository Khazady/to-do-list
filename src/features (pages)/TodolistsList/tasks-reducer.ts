import {addTodolistTC, fetchTodolistsTC, removeTodolistTC} from './todolists-reducer'
import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, UpdateTaskModelType} from '../../api/api'
import {RootStateType} from '../../app/store'
import {setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'


//thunks
export const deleteTaskTC = createAsyncThunk('tasks/deleteTask', async (arg: { todolistId: string, taskId: string }, thunkAPI) => {
    //preloader ставим перед запросом на серв
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const data = await tasksAPI.deleteTask(arg.todolistId, arg.taskId)
    try {
        //только потом диспатчим изменение в наш state
        if (data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            //возвращаем промис(т.к. async func), кот. резолвится нужным объектом
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
    //preloader
    dispatch(setAppStatusAC({status: 'loading'}))
    const data = await tasksAPI.createTask(arg.todolistId, arg.title)

    try {
        if (data.resultCode === 0) {
            const task = data.data.item
            //preloader cancel
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return task
        } else {
            handleServerAppError(data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        //ошибка нам не важна, нужно просто уведомить redux-toolkit
        return rejectWithValue(null)
    }
})
export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (arg: { todolistId: string, taskId: string, model: UpdateBusinessTaskModelType },
                                                                        {dispatch, rejectWithValue, getState}) => {
    //preloader
    dispatch(setAppStatusAC({status: 'loading'}))
    const state = getState() as RootStateType
    //ищем нужную таскую
    const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
    //на случай, если произойдет внештатная ошибка
    if (!task) {
        return rejectWithValue('task was not found in the state')
    }
    //меняем только статус, остальное берем из getState
    const serverModal: UpdateTaskModelType = {
        //не делаем копию с помощью {...task, status: status} потому что в task находятся лишние данные
        //не нужные серву (todoId, addedDate, id)
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        status: task.status,
        title: task.title,
        //тут будет 1 нужное для перезатирания свойство, оно перезапишет в serverModel
        ...arg.model
    }
    const data = await tasksAPI.updateTask(arg.todolistId, arg.taskId, serverModal)
    try {
        if (data.resultCode === 0) {
            //preloader cancel
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return arg
        } else {
            handleServerAppError(data, dispatch)
            //обабатываем ошибки своим способом, но для поддержания инфраструктуры redux-toolkit обязаны реджекать, иначе попадем в case fulfilled
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
    //кейсы, использовавшиеся в нескольких редьюсерах
    //меняя листы, мы меняем и вторую часть стейта, отвечающуую за их таски
    //syntax for auto typing
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            //добавляя новый лист, создаем пустой массив для его тасок
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            delete state[action.payload.todolistId]
        })
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            //когда нам приходят листы с api, создаем для каждого пустой массив для их тасок
            action.payload.todolists.forEach(tl => state[tl.id] = [])
        })
        //вместо явно созданного AC, берем его из TC (случай, когда санка зарезолвилась (fulfilled как в promise)
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            //находим нужный лист в ассоц. массиве по id из action и пихаем в него таски из action
            state[action.payload.todolistId] = action.payload.tasks
        })
        builder.addCase(deleteTaskTC.fulfilled, (state, action) => {
            //находим нужный массив тасок по айди
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => {
                return t.id === action.payload.taskId
            })
            //проверка нашелся ли на всякий случай
            if (index > -1) {
                //удаляем 1 элемент начиная с нужного индекса
                tasks.splice(index, 1)
            }
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            //находим в ассоц. массиве по айди и добавляем в начала таску из экшена
            state[action.payload.todoListId].unshift(action.payload)
        })
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            //проверка нашелся ли на всякий случай
            if (index > -1) {
                //меняем таску на копию с измененной моделькой из action (в ней сидит одно из свойств, кот. изм.)
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
//тип нужен, чтобы сделать 1 TC на несколько операций апдейта таски, чтобы не отправлять сразу всё
export type UpdateBusinessTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string | null
    deadline?: string | null
}
