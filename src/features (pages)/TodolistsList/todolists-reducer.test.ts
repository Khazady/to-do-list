import {
    addTodolistAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC, FilterValuesType,
    removeTodolistAC, setTodolistsAC, TodolistBusinessType,
    todolistsReducer
} from './todolists-reducer';
import {v1} from 'uuid';
import {TodolistServerType} from "../../api/api";

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistBusinessType> = [];

//перед каждым тестом задает стартовые значения
beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate:'',order:0},
        {id: todolistId2, title: "What to buy", filter: "all", addedDate:'',order:0}
    ]
})

test('correct todoList should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    let newTodolist: TodolistServerType = {
        title: "New Todolist",
        addedDate: "",
        order: 0,
        id: "blabla"
    }

    const endState = todolistsReducer(startState, addTodolistAC(newTodolist))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolist.title);
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todolistsReducer(startState, changeTodoListTitleAC(todolistId2, newTodolistTitle));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const endState = todolistsReducer(startState, changeTodoListFilterAC(todolistId2, newFilter));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test('Server todolists should transform to business todolists (add prop filter)', () => {

    const action = setTodolistsAC(startState);

    const endState = todolistsReducer([], action);

    expect(endState.length).toBe(2)
})

