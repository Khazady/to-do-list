import {
    addTodolistTC,
    changeTodolistEntityStatusAC,
    changeTodoListFilterAC,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistBusinessType,
    todolistsReducer
} from './todolists-reducer'
import {v1} from 'uuid'
import {TodolistServerType} from '../../api/api'
import {RequestStatusType} from '../../app/app-reducer'

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistBusinessType>

//перед каждым тестом задает стартовые значения
beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
        {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'}
    ]
})

test('correct todoList should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolistTC.fulfilled({todolistId: todolistId1}, 'requestedId', todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {

    let newTodolist: TodolistServerType = {
        title: 'New Todolist',
        addedDate: '',
        order: 0,
        id: 'blabla'
    }

    const endState = todolistsReducer(startState, addTodolistTC.fulfilled({todolist: newTodolist}, 'requestedId', newTodolist.title))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodolist.title)
})

test('correct todolist should change its name', () => {

    let newTodolistTitle = 'New Todolist'
    let changedTodolist = {todolistId: todolistId2, title: newTodolistTitle}
    const endState = todolistsReducer(startState, changeTodolistTitleTC.fulfilled(changedTodolist, 'requestedId', changedTodolist))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = 'completed'

    const endState = todolistsReducer(startState, changeTodoListFilterAC({todolistId: todolistId2, filter: newFilter}))

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})

test('Server todolists should transform to business todolists (add prop filter)', () => {

    const todolists = {todolists: startState}
    const action = fetchTodolistsTC.fulfilled(todolists, 'requestedId')

    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})

test('correct entityStatus of todolist should be changed', () => {

    let newEntityStatus: RequestStatusType = 'succeeded'

    const endState = todolistsReducer(startState, changeTodolistEntityStatusAC({todolistId: todolistId2, entityStatus: newEntityStatus}))

    expect(endState[0].entityStatus).toBe('idle')
    expect(endState[1].entityStatus).toBe(newEntityStatus)
})


