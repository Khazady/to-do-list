import {combineReducers} from 'redux'
import {todolistsReducer} from '../features (pages)/TodolistsList/todolists-reducer'
import {tasksReducer} from '../features (pages)/TodolistsList/tasks-reducer'
import thunkMiddleware from 'redux-thunk'
import {appReducer} from './app-reducer'
import {authReducer} from '../features (pages)/Login/auth-reducer'
import {configureStore} from '@reduxjs/toolkit'

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    //в ветке app всё что касается апп в общем(напр. светлая/темная тема, язык прилож., какой юзер сейчас авториз.)
    app: appReducer,
    auth: authReducer
})


//export const store = createStore(rootReducer, applyMiddleware(thunk))

//redux-toolkit store
export const store = configureStore({
    reducer: rootReducer,
    //adding to default middlewares thunk mw
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<RootReducerType>


//for dev
// @ts-ignore
window.store = store