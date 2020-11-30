import {Dispatch} from "redux";
import {todolistsAPI, TodolistServerType} from "../../api/api";
import {
    SetAppStatusActionType,
    setAppStatusAC,
    setAppErrorAC,
    SetAppErrorActionType,
    RequestStatusType
} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

//reducer
const initState: Array<TodolistBusinessType> = []
export const todolistsReducer = (state: Array<TodolistBusinessType> = initState, action: ActionsType): Array<TodolistBusinessType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            //добавляем в серверный тудулист фильтр
            return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            //если id листа == id в action, то возвращаем копию листа (...tl) и меняем title на тот, кот. в action
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            //если id листа == id в action, то возвращаем копию листа (...tl) и меняем filter на тот, кот. в action
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'SET-TODOLISTS':
            //на входе в этот AC приходит серверТайп, преобразовываем его в бизнесТайп, добавляя фильтр
            return action.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            //similarly to change-tl-title
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
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
//status for disabling buttons (while requesting server)
export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) =>
  ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, entityStatus} as const)


//thunks

// thunkCreator возвращает внутри себя санку (функция возвращает функцию)
export const fetchTodolistsTC = () => (dispatch: Dispatch<ActionsType>) => {
    //крутилку ставим перед запросом на серв
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.getTodolists()
      //после ответа
      .then(res => {
          dispatch(setTodolistsAC(res))
          //тд подгрузились, крутилку убираем
          dispatch(setAppStatusAC('succeeded'))
      }).catch((error) => handleServerNetworkError(error, dispatch))

}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    //disable delete button for the TL to be deleted
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    //preloader
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.deleteTodolist(todolistId)
      //после ответа
      .then(res => {
            if (res.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
                //preloader cancel
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res, dispatch)
            }
        }
      ).catch((error) => handleServerNetworkError(error, dispatch))
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionsType>) => {
    //preloader
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTodolist(title)
      //получаем с сервера
      .then(res => {
          if (res.resultCode === 0) {
              dispatch(addTodolistAC(res.data.item))
              //preloader cancel
              dispatch(setAppStatusAC('succeeded'))
          } else {
              handleServerAppError(res, dispatch)
          }
      }).catch((error) => handleServerNetworkError(error, dispatch))
}
export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    //preloader
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.updateTodolist(todolistId, title)
      //получаем с UI
      .then(res => {
          if (res.resultCode === 0) {
              dispatch(changeTodoListTitleAC(todolistId, title))
              //preloader cancel
              dispatch(setAppStatusAC('succeeded'))
          } else {
              if (res.messages.length) {
                  dispatch(setAppErrorAC(res.messages[0]))
              } else {
                  dispatch(setAppErrorAC('Some error occurred'))
              }
              dispatch(setAppStatusAC('failed'))
          }
      }).catch(error => handleServerNetworkError(error, dispatch))
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
  | SetAppStatusActionType
  | SetAppErrorActionType
  | ReturnType<typeof changeTodolistEntityStatusAC>

export type FilterValuesType = 'all' | 'active' | 'completed';
//дополняем тип, приходящий с сервера тем, что нужно UI
export type TodolistBusinessType = TodolistServerType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}