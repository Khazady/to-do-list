import {combineReducers, createStore} from "redux";
import {todolistsReducer} from "./todolists-reducer";
import {tasksReducer} from "./tasks-reducer";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
})

//создаем стор, дополняя его своим стейтом
export const store = createStore(rootReducer)

//автоматическая типизация
export type AppRootStateType = ReturnType<typeof rootReducer>




// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;