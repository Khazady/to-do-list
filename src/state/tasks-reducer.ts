import {AddTodoListActionType, RemoveTodoListActionType, SetTodolistActionType} from "./todolists-reducer";
import {TaskPriorities, tasksAPI, TasksStateType, TaskStatuses, TaskType, UpdateTaskModelType} from "../api/api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

type ActionsType = RemoveTaskActionType | AddTaskActionType | UpdateTaskActionType
    | AddTodoListActionType | RemoveTodoListActionType | SetTodolistActionType | SetTaskActionType
export type RemoveTaskActionType = {
    type: "REMOVE-TASK"
    todolistId: string
    taskId: string
}
export type AddTaskActionType = {
    type: "ADD-TASK"
    task: TaskType
}
export type UpdateTaskActionType = {
    type: "UPDATE-TASK"
    model: UpdateBusinessTaskModelType
    todolistId: string
    taskId: string
}
type SetTaskActionType = {
    type: "SET-TASKS"
    tasks: Array<TaskType>
    todolistId: string
}

const initState: TasksStateType = {

}

export const tasksReducer = (state: TasksStateType = initState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const filteredTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = filteredTasks;
            return stateCopy
        }
        case "ADD-TASK": {
            const stateCopy = {...state};
            //новая таска попадает в action из api
            const newTask = action.task
            //в таске есть свойство todoListId
            const tasks = stateCopy[newTask.todoListId]
            //переписываем в массив старые таски и кладем в начало новую
            const newTasks = [newTask, ...tasks];
            //переписываем в копию стейта массив с новой таской
            stateCopy[newTask.todoListId] = newTasks;
            return stateCopy
        }
        case "UPDATE-TASK": {
            let stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            //если id совпадает с id из action
            let newTasksArray = tasks.map(t => t.id === action.taskId
                //делаем копию таски и меняем в ней isDone
                ? {...t, ...action.model}
                //иначе возвращаем просто таску
                : t);
            stateCopy[action.todolistId] = newTasksArray
            return stateCopy
        }
        //в этом редьюсере мы должны обрабатывать экшн редьюсера тудулиста,
        //так как, мы должны создавать хранилище под таски, добавляя новый тудулист
        case "ADD-TODOLIST": {
            const stateCopy = {...state};
            stateCopy[action.todolist.id] = [];
            return stateCopy
        }
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state};
            delete stateCopy[action.id]
            return stateCopy
        }
        case "SET-TODOLISTS-TYPE": {
            const stateCopy = {...state};
            //map создает массив, а
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case "SET-TASKS": {
            const stateCopy = {...state};
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }
        default:
            return state
    }
}

//Создают экшены для (тестов и), вызываются в тестах в параметре action
export const removeTaskAC = (todolistId: string, taskId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', todolistId, taskId}
    //тоже самое что todolistId: todolistId, taskId: taskId
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', task}
}
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateBusinessTaskModelType): UpdateTaskActionType => {
    return {type: 'UPDATE-TASK', taskId, todolistId, model}
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTaskActionType => {
    return {type: "SET-TASKS", tasks, todolistId}
}

// thunkCreator возвращает внутри себя санку (функция возвращает функцию(
export const fetchTasksTC = (todolistId: string) => {
    //возвращаем санку ( анонимная функция(название не имеет смысла))
    return (dispatch: Dispatch) => {
        tasksAPI.getTasks(todolistId)
            //после ответа
            .then(res => dispatch(setTasksAC(res.items, todolistId)))
    }
}

export const deleteTaskTC = (todolistId: string, taskId: string) => {
    return (dispatch: Dispatch) => {
        //сначала делаем запрос на сервер на удаление таски
        tasksAPI.deleteTask(todolistId, taskId)
            //только потом диспатчим изменение в наш state
            .then(res => {
                const action = removeTaskAC(todolistId, taskId)
                dispatch(action)
                }
            )
    }
}

export const addTaskTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        tasksAPI.createTask(todolistId, title)
            .then(res => dispatch(addTaskAC(res.data.item)))
    }
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
export const updateTaskTC = (todolistId: string, taskId: string, businessModel: UpdateBusinessTaskModelType) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
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
}
