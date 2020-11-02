import React from 'react'
import {Provider} from 'react-redux'
import {combineReducers, createStore} from 'redux'
import {v1} from 'uuid'
import {tasksReducer} from "../../state/tasks-reducer";
import {todolistsReducer} from '../../state/todolists-reducer';
import {AppRootStateType} from "../../state/store";
import {TaskPriorities, TaskStatuses} from "../../api/api";

//decorator это как HOC, оборачивает сторисы, в данном случае в провайдер

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "all", addedDate: "", order: 0},
        {id: "todolistId2", title: "What to buy", filter: "all", addedDate: "", order: 0}
    ],
    tasks: {
        ["todolistId1"]: [
            {
                id: v1(),
                title: "HTML & CSS",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                priority: TaskPriorities.Later,
                description: "",
                startDate: "",
                deadline: "",
                order: 1,
                addedDate: ""
            },
            {
                id: v1(),
                title: "JS",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                priority: TaskPriorities.High,
                description: "",
                startDate: "",
                deadline: "",
                order: 1,
                addedDate: ""
            },
        ],
        ["todolistId2"]: [
            {
                id: v1(),
                title: "Milk",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                priority: TaskPriorities.Middle,
                description: "",
                startDate: "",
                deadline: "",
                order: 1,
                addedDate: ""
            },
            {
                id: v1(),
                title: "Bread",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                priority: TaskPriorities.Later,
                description: "",
                startDate: "",
                deadline: "",
                order: 1,
                addedDate: ""
            }
        ]
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState);
//передаем в Provider не глобальный store(store.ts), а storyBookStore
export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)