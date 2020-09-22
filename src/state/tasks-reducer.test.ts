import {tasksReducer, removeTaskAC, addTaskAC, changeTaskStatusAC, changeTaskTitleAC} from './tasks-reducer';
import {TasksStateType} from '../AppWithRedux';
import { addTodolistAC, removeTodolistAC } from './todolists-reducer';

let startState: TasksStateType = {};

beforeEach(() => {
    startState = {
        "todolistId1": [
            { id: "1", title: "CSS", isDone: false },
            { id: "2", title: "JS", isDone: true },
            { id: "3", title: "React", isDone: false }
        ],
        "todolistId2": [
            { id: "1", title: "bread", isDone: false },
            { id: "2", title: "milk", isDone: true },
            { id: "3", title: "tea", isDone: false }
        ]
    };
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(2);
    expect(endState["todolistId2"].every(t => t.id !== "2")).toBeTruthy();
    //every каждый эл-нт массива соответствует предикату (условию) а
});

test('correct task should be added to correct array', () => {

    const action = addTaskAC("todolistId2", "juice");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juice");
    expect(endState["todolistId2"][0].isDone).toBe(false);
})

test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC("2", false, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].isDone).toBeFalsy();
    expect(endState["todolistId1"][1].isDone).toBeTruthy();
});

test('title of specified task should be changed', () => {

    const action = changeTaskTitleAC("2", "MilkyWay", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe("MilkyWay");
    expect(endState["todolistId1"][1].title).toBe("JS");
});

test('new property with new array should be added when new todolist is added', () => {

    const action = addTodolistAC("new todolist");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    //возвращает массив ключей объекта
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    //проверяем есть ли ключи не равные этим значениям
    if (!newKey) {
        throw Error("new key should be added")
    }
    //добавили новый ключ, теперь их должно быть 3
    expect(keys.length).toBe(3);
    //toEqual вместо toBe потому что пустые массивы не равны друг другу
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {

    const action = removeTodolistAC("todolistId2");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});


