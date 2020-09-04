import {FilterValueType, TodoListType} from "../App";
import {v1} from "uuid";

type ActionsType =
  RemoveTodoListActionType
  | AddTodoListActionType
  | ChangeTodoListTitleActionType
  | ChangeTodoListFilterActionType;

export type RemoveTodoListActionType = {
    type: "REMOVE-TODOLIST",
    id: string
}
export type AddTodoListActionType = {
    type: "ADD-TODOLIST"
    title: string
    todolistId: string
}
export type ChangeTodoListTitleActionType = {
    type: "CHANGE-TODOLIST-TITLE",
    id: string
    title: string
}
export type ChangeTodoListFilterActionType = {
    type: "CHANGE-TODOLIST-FILTER",
    id: string
    filter: FilterValueType
}

export const todolistsReducer = (state: Array<TodoListType>, action: ActionsType): Array<TodoListType> => {

    //создавая в каждом кейсе эту переменную вылетает ошибка, поэтому созд тут, а там переопределяем
    let todoList;

    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            let newTodoList: TodoListType = {id: action.todolistId, title: action.title, filter: "all"};
            return [...state, newTodoList]
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
        default:
            throw new Error("I don't understand this type")
    }
}

//Создают экшены для тестов, вызываются в тестах в параметре action
export const removeTodolistAC = (todolistId: string): RemoveTodoListActionType => {
    return { type: 'REMOVE-TODOLIST', id: todolistId}
}
//в этом AC создаем ID здесь, а не в редьюсере, потому что этот AC используется в 2-ух редьюс.
//во избежании вызова в 2 местах v1, вызываем его 1 раз здесь
export const addTodolistAC = (todolistTitle: string): AddTodoListActionType => {
    return { type: 'ADD-TODOLIST', title: todolistTitle, todolistId: v1()}
}
export const changeTodoListTitleAC = (todolistId: string, todolistTitle: string): ChangeTodoListTitleActionType => {
    return { type: 'CHANGE-TODOLIST-TITLE', id: todolistId, title: todolistTitle}
}
export const changeTodoListFilterAC = (todolistId: string, todolistFilter: FilterValueType): ChangeTodoListFilterActionType => {
    return { type: 'CHANGE-TODOLIST-FILTER', id: todolistId, filter: todolistFilter}
}
