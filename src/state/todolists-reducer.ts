import {Dispatch} from "redux";
import {todolistsAPI, TodolistServerType} from "../api/api";

//reducer
const initState: Array<TodolistBusinessType> = []
export const todolistsReducer = (state: Array<TodolistBusinessType> = initState, action: ActionsType): Array<TodolistBusinessType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            //добавляем в серверный тудулист фильтр
            return [{...action.todolist, filter: "all"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            //если id листа == id в action, то возвращаем копию листа (...tl) и меняем title на тот, кот. в action
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            //если id листа == id в action, то возвращаем копию листа (...tl) и меняем filter на тот, кот. в action
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLISTS':
            //на входе в этот AC приходит серверТайп, преобразовываем его в бизнесТайп, добавляя фильтр
            return action.todolists.map(tl => ({...tl, filter: "all"}))
        default:
            return state;
    }
}

//actions

//альтернативная запись функции, кот. возвращ. только объект
//as const чтобы typescript воспринимал ADD-TODOLIST не как строку, а как конст(именно весь объект)
export const removeTodolistAC = (todolistId: string) =>
  ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (todolist: TodolistServerType) =>
  ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodoListTitleAC = (id: string, title: string) =>
  ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
export const changeTodoListFilterAC = (id: string, filter: FilterValuesType) =>
  ({type: 'CHANGE-TODOLIST-FILTER', id, filter} as const)
export const setTodolistsAC = (todolists: Array<TodolistServerType>) =>
  ({type: 'SET-TODOLISTS', todolists} as const)


//thunks

// thunkCreator возвращает внутри себя санку (функция возвращает функцию)
export const fetchTodolistsTC = () => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.getTodolists()
      //после ответа
      .then(res => dispatch(setTodolistsAC(res)))
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTodolist(todolistId)
      //после ответа
      .then(res => dispatch(removeTodolistAC(todolistId)))
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.createTodolist(title)
      //получаем с сервера
      .then(res => dispatch(addTodolistAC(res.data.item)))
}
export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.updateTodolist(todolistId, title)
      //получаем с UI
      .then(res => dispatch(changeTodoListTitleAC(todolistId, title)))
}


// types

//типы для AC, кот. используются сразу в нескольких редьюсерах
//т.к. их надо экспорт, мы создаем отдельные типы
export type AddTodoListActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodoListActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>
//правльная типизация AC-ов
type ActionsType =
  | AddTodoListActionType
  | RemoveTodoListActionType
  | ReturnType<typeof changeTodoListTitleAC>
  | ReturnType<typeof changeTodoListFilterAC>
  | SetTodolistActionType

export type FilterValuesType = 'all' | 'active' | 'completed';
//дополняем тип, приходящий с сервера тем, что нужно UI
export type TodolistBusinessType = TodolistServerType & {
    filter: FilterValuesType
}