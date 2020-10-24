import React, {useEffect, useState} from 'react'
import {todolistsAPI} from "../api/api";

export default {
    title: 'Todolists-API',
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsAPI.getTodolists().then(data => setState(data))
    }, [])
    //это сериализация с помощью JSON.stringify, тут будет отображаться response
    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsAPI.createTodolist("New todolist").then(data => setState(data))
    }, [])
    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsAPI.deleteTodolist("93ead9f2-1b08-4bcd-9f9c-ac46b78df725").then(data => setState(data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        todolistsAPI.updateTodolist("93ead9f2-1b08-4bcd-9f9c-ac46b78df725", "Changed todolist").then(data => setState(data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}


