import {applyMiddleware, combineReducers, createStore} from "redux";
import {todolistsReducer} from "../features (pages)/TodolistsList/todolists-reducer";
import {tasksReducer} from "../features (pages)/TodolistsList/tasks-reducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
})

//создаем стор, дополняя его своим стейтом и подключаем Middleware из thunk
export const store = createStore(rootReducer, applyMiddleware(thunk))

//автоматическая типизация
export type AppRootStateType = ReturnType<typeof rootReducer>




// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;