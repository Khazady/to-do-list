import React from 'react'
import {Provider} from 'react-redux'
import {combineReducers} from 'redux'
import {v1} from 'uuid'
import {tasksReducer} from '../../features (pages)/TodolistsList/tasks-reducer'
import {todolistsReducer} from '../../features (pages)/TodolistsList/todolists-reducer'
import {AppRootStateType, RootReducerType} from '../../app/store'
import {TaskPriorities, TaskStatuses} from '../../api/api'
import {appReducer} from '../../app/app-reducer'
import thunkMiddleware from 'redux-thunk'
import {authReducer} from '../../features (pages)/Login/auth-reducer'
import {configureStore} from '@reduxjs/toolkit'
import {BrowserRouter, HashRouter} from 'react-router-dom'

//decorator это как HOC, оборачивает сторисы, в данном случае в провайдер

const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'loading'}
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(),
                title: 'HTML & CSS',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                priority: TaskPriorities.Later,
                description: '',
                startDate: '',
                deadline: '',
                order: 1,
                addedDate: ''
            },
            {
                id: v1(),
                title: 'JS',
                status: TaskStatuses.New,
                todoListId: 'todolistId1',
                priority: TaskPriorities.High,
                description: '',
                startDate: '',
                deadline: '',
                order: 1,
                addedDate: ''
            }
        ],
        ['todolistId2']: [
            {
                id: v1(),
                title: 'Milk',
                status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                priority: TaskPriorities.Middle,
                description: '',
                startDate: '',
                deadline: '',
                order: 1,
                addedDate: ''
            },
            {
                id: v1(),
                title: 'Bread',
                status: TaskStatuses.New,
                todoListId: 'todolistId2',
                priority: TaskPriorities.Later,
                description: '',
                startDate: '',
                deadline: '',
                order: 1,
                addedDate: ''
            }
        ]
    },
    app: {status: 'succeeded', error: 'some error', isInitialized: true},
    auth: {isLoggedIn: true}
}

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})
//передаем в Provider не глобальный store(store.ts), а storyBookStore
export const ReduxStoreProviderDecorator = (storyFn: any) => (
  <Provider store={storyBookStore}>
      <HashRouter>
          {storyFn()}
      </HashRouter>
  </Provider>)
