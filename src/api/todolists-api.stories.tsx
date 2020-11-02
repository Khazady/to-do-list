import React, {useEffect, useState} from 'react'
import {todolistsAPI} from "./api";

export default {
    title: 'TodolistsList-API',
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState("")
    useEffect(() => {
        todolistsAPI.getTodolists().then(data => setState(data))
    }, [])
    const createTodolist = () => {
        todolistsAPI.createTodolist(title).then(data => setState(data))
    }
    //если стейт не пустой, то сериализация
    //если пустой, то создать новый ( state? потому что он изначально === null )
    if (state?.length !== 0) {
        return <div> {JSON.stringify(state)}</div>
    } else {
        return <>
            <input placeholder={"title"} value={title} onChange={e => setTitle(e.currentTarget.value)}/>
            <button onClick={createTodolist}>create todolist</button>
        </>
    }
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState("")
    const createTodolist = () => {
        todolistsAPI.createTodolist(title).then(data => setState(data))
    }
    return <>
        <input placeholder={"title"} value={title} onChange={e => setTitle(e.currentTarget.value)}/>
        <button onClick={createTodolist}>create todolist</button>
        <div> {JSON.stringify(state)}</div>
    </>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState("")
    const deleteTodolist = () => {
        todolistsAPI.deleteTodolist(todolistId).then(data => setState(data))
    }

    return <>
        <input placeholder={"todolistId"} value={todolistId} onChange={e => setTodolistId(e.currentTarget.value)}/>
        <button onClick={deleteTodolist}>delete todolist</button>
        <div> {JSON.stringify(state)}</div>
    </>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState("");
    const [title, setTitle] = useState("")
    const updateTodolist = () => {
        todolistsAPI.updateTodolist(todolistId, title).then(data => setState(data))
    }

    return <>
        <input value={title} placeholder={"changed list title"} onChange={e => setTitle(e.currentTarget.value)}/>
        <input value={todolistId} placeholder={"todolistId"} onChange={e => setTodolistId(e.currentTarget.value)}/>
        <button onClick={updateTodolist}>update todolist</button>
        <div> {JSON.stringify(state)}</div>
    </>
}


