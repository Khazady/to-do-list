import {addTodolistAC, removeTodolistAC, setTodolistsAC} from './todolists-reducer'
import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, UpdateTaskModelType} from '../../api/api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

// reducer
const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string }>) {
            //находим нужный массив тасок по айди
            /*const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id !== action.payload.taskId)
            //проверка нашелся ли на всякий случай
            if(index > -1) {
                //удаляем 1 элемент начиная с нужного индекса
                tasks.splice(index, 1)
            }*/
            return {
                ...state,
                //в нужном листе (из action id) фильтруем все таски, кроме той, что пришла в action
                [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id === action.payload.taskId)
            }
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            //находим в ассоц. массиве по айди и добавляем в начала таску из экшена
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string, model: UpdateBusinessTaskModelType }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            //проверка нашелся ли на всякий случай
            if(index > -1) {
                //меняем таску на копию с измененной моделькой из action (в ней сидит одно из свойств, кот. изм.)
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            //находим нужный лист в ассоц. массиве по id из action и пихаем в него таски из action
            state[action.payload.todolistId] = action.payload.tasks
        }
    },
    //кейсы, использовавшиеся в нескольких редьюсерах
    //меняя листы, мы меняем и вторую часть стейта, отвечающуую за их таски
    //syntax for auto typing
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            //добавляя новый лист, создаем пустой массив для его тасок
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistId]
        })
        builder.addCase(setTodolistsAC, (state, action) => {
            //когда нам приходят листы с api, создаем для каждого пустой массив для их тасок
            action.payload.todolists.forEach(tl => state[tl.id] = [])
        })
    }
})

export const tasksReducer = slice.reducer
//actions
export const {removeTaskAC, addTaskAC, updateTaskAC, setTasksAC} = slice.actions

//thunks
export const fetchTasksTC = (todolistId: string) =>
  (dispatch: Dispatch) => {
      //preloader
      dispatch(setAppStatusAC({status: 'loading'}))
      tasksAPI.getTasks(todolistId)
        //после ответа
        .then(res => {
            dispatch(setTasksAC({tasks: res.items, todolistId}))
            //preloader cancel
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
  }
export const deleteTaskTC = (todolistId: string, taskId: string) =>
  //возвращаем санку ( анонимная функция(название не имеет смысла))
  (dispatch: Dispatch) => {
      //preloader ставим перед запросом на серв
      dispatch(setAppStatusAC({status: 'loading'}))
      //сначала делаем запрос на сервер на удаление таски
      tasksAPI.deleteTask(todolistId, taskId)
        //только потом диспатчим изменение в наш state
        .then(res => {
              if (res.resultCode === 0) {
                  const action = removeTaskAC({todolistId, taskId})
                  dispatch(action)
                  dispatch(setAppStatusAC({status: 'succeeded'}))
              } else {
                  handleServerAppError(res, dispatch)
              }
          }
        ).catch((error) => handleServerNetworkError(error, dispatch))
  }
export const addTaskTC = (todolistId: string, title: string) =>
  //возвращаем санку ( анонимная функция(название не имеет смысла))
  (dispatch: Dispatch) => {
      //preloader
      dispatch(setAppStatusAC({status: 'loading'}))
      tasksAPI.createTask(todolistId, title)
        .then(res => {
            if (res.resultCode === 0) {
                dispatch(addTaskAC({task: res.data.item}))
                //preloader cancel
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res, dispatch)
            }
        }).catch(error => handleServerNetworkError(error, dispatch))
  }
export const updateTaskTC = (todolistId: string, taskId: string, businessModel: UpdateBusinessTaskModelType) =>
  //возвращаем санку ( анонимная функция(название не имеет смысла))
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
      //preloader
      dispatch(setAppStatusAC({status: 'loading'}))
      const state = getState()
      //ищем нужную таскую
      const task = state.tasks[todolistId].find(t => t.id === taskId)
      //на случай, если произойдет внештатная ошибка
      if (!task) {
          console.warn('task was not found in the state')
          return
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
          ...businessModel
      }
      tasksAPI.updateTask(todolistId, taskId, serverModal)
        .then(res => {
            if (res.resultCode === 0) {
                dispatch(updateTaskAC({todolistId, taskId, model: businessModel}))
                //preloader cancel
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res, dispatch)
            }
        }).catch(error => handleServerNetworkError(error, dispatch))
  }


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
