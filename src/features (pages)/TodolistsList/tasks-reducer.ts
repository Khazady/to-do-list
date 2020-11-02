import {AddTodoListActionType, RemoveTodoListActionType, SetTodolistActionType} from "./todolists-reducer";
import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, UpdateTaskModelType} from "../../api/api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";

// reducer
const initState: TasksStateType = {}
export const tasksReducer = (state: TasksStateType = initState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                //в нужном листе (из action id) фильтруем все таски, кроме той, что пришла в action
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        case 'ADD-TASK':
            return {
                ...state,
                //находим в ассоциативном массиве по свойству в таске и подменяем на новый массив, где в начале будет
                //новая таска из api, а дальше всё, что было раньше
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        case 'UPDATE-TASK':
            return {
                ...state,
                //находим в ассоциативном массиве нужный лист по свойству в action
                //map возвращает копию массива и пробегается по таскам, ищем нужную таску по свойству в action
                //и меняем таску на копию с измененной моделькой из action (в ней сидит одно из свойств, кот. изм.)
                [action.todolistId]: state[action.todolistId].map(task =>
                  task.id === action.taskId ? {...task, ...action.model} : task)
            }
      //в этих редьюсерах мы должны обрабатывать action todolist редьюсера,
      //так как, меняя листы, мы меняем и вторую часть стейта, отвечающуую за их таски
        case 'ADD-TODOLIST':
            return {
                ...state,
                //добавляя новый лист, создаем пустой массив для его тасок
                [action.todolist.id]: []
            }
        case 'REMOVE-TODOLIST': {
            //скобки, т.к. создаем переменные
            //нельзя записью прямо в объекте удалить массив тасок
            const stateCopy = {...state};
            delete stateCopy[action.id]
            return stateCopy
        }
        case 'SET-TODOLISTS': {
            const stateCopy = {...state};
            //map создает массив, а forEach меняет существующий
            //когда нам приходят листы с api, создаем для каждого пустой массив для их тасок
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case 'SET-TASKS':
            return {
                ...state,
                //находим нужный лист в ассоц. массиве по id из action и пихаем в него таски из action
                [action.todolistId]: action.tasks
            }
        default:
            return state
    }
}

//actions

//альтернативная запись функции, кот. возвращ. только объект
//as const чтобы typescript воспринимал ADD-TODOLIST не как строку, а как конст(именно весь объект)
//тоже самое что todolistId: todolistId, taskId: taskId
export const removeTaskAC = (todolistId: string, taskId: string) =>
  ({type: 'REMOVE-TASK', todolistId, taskId} as const)
export const addTaskAC = (task: TaskType) =>
  ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateBusinessTaskModelType) =>
  ({type: 'UPDATE-TASK', taskId, todolistId, model} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
  ({type: 'SET-TASKS', tasks, todolistId} as const)


//thunks

// thunkCreator возвращает внутри себя санку (функция возвращает функцию(
//после первой функции => сразу возвращаем вторую (dispatch) =>
export const fetchTasksTC = (todolistId: string) =>
  //возвращаем санку ( анонимная функция(название не имеет смысла))
  (dispatch: Dispatch<ActionsType>) => {
      tasksAPI.getTasks(todolistId)
        //после ответа
        .then(res => dispatch(setTasksAC(res.items, todolistId)))
  }
export const deleteTaskTC = (todolistId: string, taskId: string) =>
  //возвращаем санку ( анонимная функция(название не имеет смысла))
  (dispatch: Dispatch<ActionsType>) => {
      //сначала делаем запрос на сервер на удаление таски
      tasksAPI.deleteTask(todolistId, taskId)
        //только потом диспатчим изменение в наш state
        .then(res => {
              const action = removeTaskAC(todolistId, taskId)
              dispatch(action)
          }
        )
  }
export const addTaskTC = (todolistId: string, title: string) =>
  //возвращаем санку ( анонимная функция(название не имеет смысла))
  (dispatch: Dispatch<ActionsType>) => {
      tasksAPI.createTask(todolistId, title)
        .then(res => dispatch(addTaskAC(res.data.item)))
  }
export const updateTaskTC = (todolistId: string, taskId: string, businessModel: UpdateBusinessTaskModelType) =>
  //возвращаем санку ( анонимная функция(название не имеет смысла))
  (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
      const state = getState()
      //ищем нужную таскую
      const task = state.tasks[todolistId].find(t => t.id === taskId)
      //на случай, если произойдет внештатная ошибка
      if (!task) {
          console.warn("task was not found in the state")
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
        .then(res => dispatch(updateTaskAC(todolistId, taskId, businessModel)))
  }


// types

//правльная типизация AC-ов
type ActionsType =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof updateTaskAC>
  | ReturnType<typeof setTasksAC>
  | AddTodoListActionType
  | RemoveTodoListActionType
  | SetTodolistActionType
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
