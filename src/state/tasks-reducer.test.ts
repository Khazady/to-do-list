import {tasksReducer, removeTaskAC, addTaskAC, changeTaskStatusAC, changeTaskTitleAC} from './tasks-reducer';
import {addTodolistAC, removeTodolistAC} from './todolists-reducer';
import {TaskPriorities, TasksStateType, TaskStatuses} from "../api/api";

let startState: TasksStateType = {};

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1", title: "CSS", status: TaskStatuses.New,
                todoListId: "todolistId1",
                priority: TaskPriorities.Later,
                description: "",
                startDate: "",
                deadline: "",
                order: 1,
                addedDate: ""
            },
            {
                id: "2", title: "JS", status: TaskStatuses.Completed,
                todoListId: "todolistId1",
                priority: TaskPriorities.Later,
                description: "",
                startDate: "",
                deadline: "",
                order: 1,
                addedDate: ""
            },
            {
                id: "3", title: "React", status: TaskStatuses.New,
                todoListId: "todolistId1",
                priority: TaskPriorities.Later,
                description: "",
                startDate: "",
                deadline: "",
                order: 1,
                addedDate: ""
            }
        ],
        "todolistId2": [
            {
                id: "1", title: "bread", status: TaskStatuses.New,
                todoListId: "todolistId2",
                priority: TaskPriorities.Later,
                description: "",
                startDate: "",
                deadline: "",
                order: 1,
                addedDate: ""
            },
            {
                id: "2", title: "milk", status: TaskStatuses.Completed,
                todoListId: "todolistId2",
                priority: TaskPriorities.Later,
                description: "",
                startDate: "",
                deadline: "",
                order: 1,
                addedDate: ""
            },
            {
                id: "3", title: "tea", status: TaskStatuses.New,
                todoListId: "todolistId2",
                priority: TaskPriorities.Later,
                description: "",
                startDate: "",
                deadline: "",
                order: 1,
                addedDate: ""
            }
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
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC("2", TaskStatuses.New, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
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


