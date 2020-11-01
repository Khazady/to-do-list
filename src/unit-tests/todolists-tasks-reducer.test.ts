import {addTodolistAC, TodolistBusinessType, todolistsReducer} from "../state/todolists-reducer";
import { tasksReducer } from "../state/tasks-reducer";
import {TasksStateType} from "../api/api";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistBusinessType> = [];

    const action = addTodolistAC({
        id: "blabla",
        title: "new todolist",
        addedDate: "",
        order: 0
    });

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolist.id);
    expect(idFromTodolists).toBe(action.todolist.id);
});
