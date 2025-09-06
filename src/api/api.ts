// DAL is the client's last stop before the server, so there can't be other imports besides axios
import axios from "axios";

const instance = axios.create({
    withCredentials: true,
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    headers: {
        "API-KEY": "a13d3464-2e9e-4272-8cbf-d0d1a9048e02"
    }
});


//api
export const todolistsAPI = {
    getTodolists() {
        // return only the data portion of the response
        // generic of what this method returns (as per docs)
        return instance.get<Array<TodolistServerType>>("todo-lists").then(res => res.data)
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistServerType}>>("todo-lists", {title: title}).then(res => res.data)
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`).then(res => res.data)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title: title}).then(res => res.data)
    }
}
export const tasksAPI = {
    getTasks(todolistId: string) {
        // get a portion of tasks of a specific todolist
        // generic of what this method returns (as per docs)
        // Item will be an array of objects {items: TaskType}
        return instance.get<GetTaskResponse<Array<TaskType>>>(`todo-lists/${todolistId}/tasks`).then(res => res.data)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title: title}).then(res => res.data)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`).then(res => res.data)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks/${taskId}`, model).then(res => res.data)
    }
}
export const authAPI = {
    login(loginData: LoginParamsType) {
        // returns a promise
        return instance.post<ResponseType<{userId?: number}>>(`auth/login`, loginData).then(res => res.data)
    },
    me() {
        return instance.get<ResponseType<{id:number, email: string, login: string}>>(`auth/me`).then(res => res.data)
    },
    logout() {
        return instance.delete<ResponseType>(`auth/login`).then(res => res.data)
    }
}


// types

// application development starts with API, so we describe the types of data coming from server here
export type TodolistServerType = {
    id: string
    title: string
    addedDate: string
    order: number
}
// item is the variable we insert into generic when used (e.g. <ResponseType<{item: TodolistType}>> ) --
// -- means data will contain item; otherwise data is an empty object ( <ResponseType<{}>> )

export type FieldErrorType = { field: string, error: string }
// generic can have default value; if no specific generic is provided, Item = {}
export type ResponseType<Item = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors?: Array<FieldErrorType>
    data: Item
}
type GetTaskResponse<Item = {}> = {
    error: string | null
    totalCount: number
    items: Item
}
// special type/variable extending boolean, because false and true are not enough for request statuses
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgently = 3,
    Later = 4
}
export type TaskType = {
    description: string | null
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string | null
    deadline: string | null
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type UpdateTaskModelType = {
    title: string
    description: string | null
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string | null
    deadline: string | null
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}
