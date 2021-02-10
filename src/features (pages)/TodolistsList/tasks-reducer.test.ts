import {addTaskTC, deleteTaskTC, fetchTasksTC, tasksReducer, TasksStateType, updateTaskTC} from './tasks-reducer'
import {addTodolistTC, fetchTodolistsTC, removeTodolistTC} from './todolists-reducer'
import {TaskPriorities, TaskStatuses} from '../../api/api'

let startState: TasksStateType = {}

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1', title: 'CSS', status: TaskStatuses.New,
                todoListId: 'todolistId1',
                priority: TaskPriorities.Later,
                description: '',
                startDate: '',
                deadline: '',
                order: 1,
                addedDate: ''
            },
            {
                id: '2', title: 'JS', status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                priority: TaskPriorities.Later,
                description: '',
                startDate: '',
                deadline: '',
                order: 1,
                addedDate: ''
            },
            {
                id: '3', title: 'React', status: TaskStatuses.New,
                todoListId: 'todolistId1',
                priority: TaskPriorities.Later,
                description: '',
                startDate: '',
                deadline: '',
                order: 1,
                addedDate: ''
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', status: TaskStatuses.New,
                todoListId: 'todolistId2',
                priority: TaskPriorities.Later,
                description: '',
                startDate: '',
                deadline: '',
                order: 1,
                addedDate: ''
            },
            {
                id: '2', title: 'milk', status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                priority: TaskPriorities.Later,
                description: '',
                startDate: '',
                deadline: '',
                order: 1,
                addedDate: ''
            },
            {
                id: '3', title: 'tea', status: TaskStatuses.New,
                todoListId: 'todolistId2',
                priority: TaskPriorities.Later,
                description: '',
                startDate: '',
                deadline: '',
                order: 1,
                addedDate: ''
            }
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    let param = {todolistId: 'todolistId2', taskId: '2'}
    const action = deleteTaskTC.fulfilled(param, 'requestId', param)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(2)
    expect(endState['todolistId2'].every(t => t.id != '2')).toBeTruthy()
    //every каждый эл-нт массива соответствует предикату (условию)
})

test('correct task should be added to correct array', () => {
    const task = {
        todoListId: 'todolistId2',
        title: 'juice',
        status: TaskStatuses.New,
        id: 'testTaskId',
        addedDate: '', deadline: '', description: '', priority: 0, startDate: '', order: 0
    }
    const action = addTaskTC.fulfilled(task, 'requestId', {title: task.title, todolistId: task.todoListId})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juice')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {
    const updatedModel = {
        todolistId: 'todolistId2',
        taskId: '2',
        model: {status: TaskStatuses.New}
    }
    const action = updateTaskTC.fulfilled(updatedModel, 'requestedId', updatedModel)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
})

test('title of specified task should be changed', () => {
    const updatedModel = {
        todolistId: 'todolistId2',
        taskId: '2',
        model: {title: 'MilkyWay'}
    }
    const action = updateTaskTC.fulfilled(updatedModel, 'requestedId', updatedModel)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].title).toBe('MilkyWay')
    expect(endState['todolistId1'][1].title).toBe('JS')
})

test('new property with new array should be added when new todolist is added', () => {
    let todolist = {
        title: 'new todolist',
        id: 'blabla',
        order: 0,
        addedDate: ''
    }
    const action = addTodolistTC.fulfilled({todolist}, 'requestedId', todolist.title)

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    //возвращает массив ключей объекта
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    //проверяем есть ли ключи не равные этим значениям
    if (!newKey) {
        throw Error('new key should be added')
    }
    //добавили новый ключ, теперь их должно быть 3
    expect(keys.length).toBe(3)
    //toEqual вместо toBe потому что пустые массивы не равны друг другу
    expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {

    const action = removeTodolistTC.fulfilled({todolistId: 'todolistId2'}, 'requestedId', 'todolistId2')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

test('empty arrays should be added when we set todolists', () => {
    const todolists = {
        todolists: [
            {id: '1', title: 'title1', order: 0, addedDate: ''},
            {id: '2', title: 'title2', order: 0, addedDate: ''}
        ]
    }
    const action = fetchTodolistsTC.fulfilled(todolists, 'requestedId')
    //должны создаться пустые массивы под таски
    const endState = tasksReducer({}, action)
    //массив из ключей
    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toStrictEqual([])
    expect(endState['2']).toStrictEqual([])
})

test('tasks should be added for todolist', () => {
    //передаю таски из ассоц. массива по ключу todolistId1 и айдишник тудулиста, которым является стринга todolistId1
    const action = fetchTasksTC.fulfilled({
        tasks: startState['todolistId2'],
        todolistId: 'todolistId2'
    }, 'requestId', 'todolistId2')
    //изначальное состояние endState
    const endState = tasksReducer({
        'todolistId1': [],
        'todolistId2': []
    }, action)
    //длина ассоц. массива
    expect(endState['todolistId2'].length).toBe(3)
    expect(endState['todolistId1'].length).toBe(0)
})

