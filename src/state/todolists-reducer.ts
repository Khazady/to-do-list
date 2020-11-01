import {Dispatch} from "redux";
import {todolistsAPI, TodolistServerType} from "../api/api";

type ActionsType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | ChangeTodoListTitleActionType
    | ChangeTodoListFilterActionType
    | SetTodolistActionType

export type RemoveTodoListActionType = {
    type: "REMOVE-TODOLIST",
    id: string
}
export type AddTodoListActionType = {
    type: "ADD-TODOLIST"
    todolist: TodolistServerType
}
export type ChangeTodoListTitleActionType = {
    type: "CHANGE-TODOLIST-TITLE",
    id: string
    title: string
}
export type ChangeTodoListFilterActionType = {
    type: "CHANGE-TODOLIST-FILTER",
    id: string
    filter: FilterValuesType
}
export type SetTodolistActionType = {
    type: "SET-TODOLISTS-TYPE",
    todolists: Array<TodolistServerType>
}

export type FilterValuesType = "all" | "active" | "completed";
//дополняем тип, приходящий с сервера тем, что нужно UI
export type TodolistBusinessType = TodolistServerType & {
    filter: FilterValuesType
}

const initState: Array<TodolistBusinessType> = []
export const todolistsReducer = (state: Array<TodolistBusinessType> = initState, action: ActionsType): Array<TodolistBusinessType> => {

    //создавая в каждом кейсе эту переменную вылетает ошибка, поэтому созд тут, а там переопределяем
    let todoList;

    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            //добавляем в серверный тудулист фильтр
            const newTodolist: TodolistBusinessType = {
                ...action.todolist,
                filter: "all"
            }
            return [newTodolist, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            todoList = state.filter(tl => tl.id === action.id);
            if (todoList) {
                todoList[0].title = action.title;
            }
            return [...state];
        case 'CHANGE-TODOLIST-FILTER':
            todoList = state.find(todoList => todoList.id === action.id);
            if (todoList) {
                todoList.filter = action.filter
            }
            return [...state];
        case "SET-TODOLISTS-TYPE":
            //на входе в этот AC приходит серверТайп, преобразовываем его в бизнесТайп, добавляя фильтр
            return action.todolists.map(tl => {
                return {...tl, filter: "all"}
            })
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodoListActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
//в этом AC создаем ID здесь, а не в редьюсере, потому что этот AC используется в 2-ух редьюс.
//во избежании вызова в 2 местах v1, вызываем его 1 раз здесь
export const addTodolistAC = (todolist: TodolistServerType): AddTodoListActionType => {
    return {type: 'ADD-TODOLIST', todolist}
}
export const changeTodoListTitleAC = (todolistId: string, todolistTitle: string): ChangeTodoListTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: todolistId, title: todolistTitle}
}
export const changeTodoListFilterAC = (todolistId: string, todolistFilter: FilterValuesType): ChangeTodoListFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: todolistId, filter: todolistFilter}
}
export const setTodolistsAC = (todolists: Array<TodolistServerType>): SetTodolistActionType => {
    return {type: 'SET-TODOLISTS-TYPE', todolists: todolists}
}
// thunkCreator возвращает внутри себя санку (функция возвращает функцию(
export const fetchTodolistsTC = () => {
    //возвращаем санку ( анонимная функция(название не имеет смысла))
    return (dispatch: Dispatch) => {
        todolistsAPI.getTodolists()
            //после ответа
            .then(res => dispatch(setTodolistsAC(res)))
    }
}

export const removeTodolistTC = (todolistId: string) => {
    //возвращаем санку ( анонимная функция(название не имеет смысла))
    return (dispatch: Dispatch) => {
        todolistsAPI.deleteTodolist(todolistId)
            //после ответа
            .then(res => dispatch(removeTodolistAC(todolistId)))
    }
}

export const addTodolistTC = (title: string) => {
    //возвращаем санку ( анонимная функция(название не имеет смысла))
    return (dispatch: Dispatch) => {
        todolistsAPI.createTodolist(title)
            //получаем с сервера
            .then(res => dispatch(addTodolistAC(res.data.item)))
    }
}

export const changeTodolistTitleTC = (todolistId: string, title: string) => {
    //возвращаем санку ( анонимная функция(название не имеет смысла))
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolist(todolistId, title)
            //получаем с UI
            .then(res => dispatch(changeTodoListTitleAC(todolistId, title)))
    }
}