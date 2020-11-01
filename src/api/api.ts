import axios from "axios";

const instance = axios.create({
    withCredentials: true,
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    headers: {
        "API-KEY": "a13d3464-2e9e-4272-8cbf-d0d1a9048e02"
    }
});


//с API начинается разработка приложения, поэтому типы того, что приходит с сервера описываем в API
export type TodolistServerType = {
    id: string
    title: string
    addedDate: string
    order: number
}
//item это переменная, которую вставляем в generic при использовании (например <ResponseType<{item: TodolistType}>> ) --
//-- значит, что в data будет item, в других случаях data - пустой объект ( <ResponseType<{}>> )
//в generic можно передать дефолт значение, если не писать уточняющий generic, то Item = {}
type ResponseType<Item = {}> = {
    resultCode: number,
    messages: Array<string>
    data: Item
}
type GetTaskResponse<Item = {}> = {
    error: string | null
    totalCount: number
    items: Item
}
//особый тип/переменная, расширяющий boolean, так как false и true не хватает для статусов (запросов)
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
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type UpdateTaskModelType = {
    title: string
    description: string | null
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string | null
    deadline: string | null
}



export const todolistsAPI = {
    getTodolists() {
        //оставляем в ответе только дату
        //generic того, что нам возвращает этот метод (в документации)
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
        //получаем порцию тасок конкретного todolist
        //generic того, что нам возвращает этот метод (в документации)
        //в Item будет массив объектов {items:TaskType}
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