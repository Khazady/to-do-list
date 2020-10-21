import {combineReducers, createStore} from "redux";
import {todolistsReducer} from "./todolists-reducer";
import {tasksReducer} from "./tasks-reducer";

const rootReducer = combineReducers({
    todolist: todolistsReducer,
    tasks: tasksReducer
})

//автоматическая типизация
export type AppRootState = ReturnType<typeof rootReducer>


//создаем стор, дополняя его своим стейтомi
export const store = createStore(rootReducer)