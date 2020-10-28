import {v1} from "uuid";
import {AddTodoListActionType, RemoveTodoListActionType} from "./todolists-reducer";
import {TaskPriorities, TasksStateType, TaskStatuses, TaskType} from "../api/api";

type ActionsType = RemoveTaskActionType | AddTaskActionType | ChangeTaskStatusActionType | ChangeTaskTitleActionType
    | AddTodoListActionType | RemoveTodoListActionType;
export type RemoveTaskActionType = {
    type: "REMOVE-TASK"
    todolistId: string
    taskId: string
}
export type AddTaskActionType = {
    type: "ADD-TASK"
    title: string
    todolistId: string
}
export type ChangeTaskStatusActionType = {
    type: "CHANGE-TASK-STATUS"
    status: TaskStatuses
    todolistId: string
    taskId: string
}
export type ChangeTaskTitleActionType = {
    type: "CHANGE-TASK-TITLE"
    title: string
    todolistId: string
    taskId: string
}

const initState: TasksStateType = {
    count: []
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
            const tasks = stateCopy[action.todolistId];
            const newTask: TaskType = {
                id: v1(),
                todoListId: action.todolistId,
                title: action.title,
                status: TaskStatuses.New,
                priority: TaskPriorities.Middle,
                description: "", startDate: "", deadline: "", order: 1, addedDate: ""
            };
            const newTasks = [newTask, ...tasks];
            stateCopy[action.todolistId] = newTasks;
            return stateCopy
        }
        case "CHANGE-TASK-STATUS": {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            //если id совпадает с id из action
            stateCopy[action.todolistId] = tasks.map(t => t.id === action.taskId
                //делаем копию таски и меняем в ней isDone
                ? {...t, status: action.status}
                //иначе возвращаем просто таску
                : t);
            return stateCopy
        }
        case "CHANGE-TASK-TITLE": {
            //shallow copy
            const stateCopy = {...state}
            //старые таски
            const tasks = stateCopy[action.todolistId];
            //делаем копию таски и меняем в ней title, если id совпадает с id из action
            stateCopy[action.todolistId] = tasks.map(t => t.id === action.taskId ? {...t, title: action.title} : t);
            return stateCopy
        }
        //в этом редьюсере мы должны обрабатывать экшн редьюсера тудулиста,
        //так как, мы должны создавать хранилище под таски, добавляя новый тудулист
        case "ADD-TODOLIST": {
            const stateCopy = {...state};
            stateCopy[action.todolistId] = [];
            return stateCopy
        }
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state};
            delete stateCopy[action.id]
            return stateCopy
        }
        default:
            return state
    }
}

//Создают экшены для (тестов и), вызываются в тестах в параметре action
export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', todolistId, taskId}
    //тоже самое что todolistId: todolistId, taskId: taskId
}
export const addTaskAC = (todolistId: string, title: string): AddTaskActionType => {
    return {type: 'ADD-TASK', title, todolistId}
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', taskId, todolistId, status}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', taskId, todolistId, title}
}
