import React, {useEffect, useState} from 'react'
import {tasksAPI} from "../api/api";

export default {
    title: 'Tasks-API',
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "52c65c8d-6baf-4f38-b73f-7b87a895462a";
        tasksAPI.getTasks(todolistId).then(data => setState(data))
    }, [])
    //это сериализация с помощью JSON.stringify, тут будет отображаться response
    return <div> {JSON.stringify(state)}</div>
}

//post
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "52c65c8d-6baf-4f38-b73f-7b87a895462a"
        tasksAPI.createTask(todolistId, "New task").then(data => setState(data))
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>("")
    const [taskId, setTaskId] = useState<string>("")
    const deleteTask = () => {
        tasksAPI.deleteTask(todolistId, taskId).then(data => setState(data))
    }

    return (
        <>
            <div>
                <input placeholder={"todolistId"} value={todolistId} onChange={e => setTodolistId(e.currentTarget.value)}/>
                <input placeholder={"taskId"} value={taskId} onChange={e => setTaskId(e.currentTarget.value)}/>
                <button onClick={deleteTask}>delete task</button>
            </div>
            <div> {JSON.stringify(state)}</div>
        </>
    )
}

//put
export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    const todolistId = "52c65c8d-6baf-4f38-b73f-7b87a895462a"
    const taskId = "72548591-26d6-4736-acdb-482a2669d134"
    useEffect(() => {
        tasksAPI.updateTask(todolistId, taskId, "Changed task").then(data => setState(data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
