import React, {useState} from 'react'
import {tasksAPI} from "./api";
//доделать useState-ы и кнопки для всех(как в deleteTask) и кнопку в getTask которая будет createTask, если там пусто(последние 15 минут 13 урока)
export default {
    title: 'Tasks-API',
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState("")
    const getTask = () => {
        tasksAPI.getTasks(todolistId).then(data => setState(data))
    }
    //это сериализация с помощью JSON.stringify, тут будет отображаться response
    return (
        <>
            <input placeholder={"todolist id"} value={todolistId} onChange={e => setTodolistId(e.currentTarget.value)}/>
            <button onClick={getTask}>get tasks of the todolist</button>
            <div> {JSON.stringify(state)}</div>
        </>
    )
}

//post
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState("");
    const [title, setTitle] = useState("")
    const createTask = () => {
        tasksAPI.createTask(todolistId, title).then(data => {
            debugger
            return setState(data)
        })
    }
    return <>
        <input value={title} placeholder={"task title"} onChange={e => setTitle(e.currentTarget.value)}/>
        <input value={todolistId} placeholder={"todolist id"} onChange={e => setTodolistId(e.currentTarget.value)}/>
        <button onClick={createTask}>create task</button>
        <div> {JSON.stringify(state)}</div>
    </>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>("")
    const [taskId, setTaskId] = useState<string>("")
    const deleteTask = () => {
        tasksAPI.deleteTask(todolistId, taskId).then(data => setState(data))
    }

    return <>
        <div>
            <input placeholder={"todolist id"} value={todolistId}
                   onChange={e => setTodolistId(e.currentTarget.value)}/>
            <input placeholder={"task id"} value={taskId} onChange={e => setTaskId(e.currentTarget.value)}/>
            <button onClick={deleteTask}>delete task</button>
        </div>
        <div> {JSON.stringify(state)}</div>
    </>
}

//put
export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>("")
    const [taskId, setTaskId] = useState<string>("")
    const [title, setTitle] = useState("")
    let model = {
        title: title,
        description: "string",
        status: 1,
        priority: 1,
        //здесь нужно получать актуальную дату в этом формате
        startDate: null,
        deadline: null
    }
    const updateTaskTitle = () => {
        tasksAPI.updateTask(todolistId, taskId, model).then(data => setState(data))
    }

    return <>
        <div>
            <input placeholder={"todolist id"} value={todolistId} onChange={e => setTodolistId(e.currentTarget.value)}/>
            <input placeholder={"task id"} value={taskId} onChange={e => setTaskId(e.currentTarget.value)}/>
            <input placeholder={"new task title"} value={title} onChange={e => setTitle(e.currentTarget.value)}/>
            <button onClick={updateTaskTitle}>update task title</button>
        </div>
        <div> {JSON.stringify(state)}</div>
    </>
}
