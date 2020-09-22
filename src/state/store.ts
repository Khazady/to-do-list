import {combineReducers, createStore} from "redux";
import {todolistsReducer} from "./todolists-reducer";
import {tasksReducer} from "./tasks-reducer";

// 1 главный reducer, который раскидывает экшены
const rootReducer = combineReducers({
    //за стейт тудулиста отвечает тудулистредьюсер и тд
    todolist: todolistsReducer,
    tasks: tasksReducer
})

// type AppRootState = {
//     todolists: Array<TodoListType>
//     tasks: TasksStateType
// }

//автоматическая типизация
export type AppRootState = ReturnType<typeof rootReducer>



export const store = createStore(rootReducer)