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
    // the app branch stores general app settings (e.g., light/dark theme, app language, currently authorized user)
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
export type RootStateType = ReturnType<RootReducerType>

export type DispatchType = typeof store.dispatch



//for dev
// @ts-ignore
window.store = store

