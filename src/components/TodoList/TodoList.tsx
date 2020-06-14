import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import {TaskType} from "../../App";
import {FilterValueType} from "../../App";

type TodoListPropsType = {
  title: string
  tasks: Array<TaskType>
  removeTask: (id: string) => void
  changeFilter: (value: FilterValueType) => void
  addTask: (title: string) => void
}

export function TodoList(props: TodoListPropsType) {

    const [newTaskTitle, setNewTaskTitle] = useState("");

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    };

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        e.charCode === 13 && addNewTask()
    }

    const addNewTask = () => {
        props.addTask(newTaskTitle);
        setNewTaskTitle("")
    };

    const liElementDrawer = props.tasks.map((task) => {
        const onRemoveHandler = () => {props.removeTask(task.id)};

        return (
          <li key={task.id}>
              <input type="checkbox" checked={task.isDone}/>
              <span>{task.title}</span>
              <button onClick={ onRemoveHandler }>×</button>
          </li>
        )
    })

    const onAllClickHandler = () => props.changeFilter("all") ;

    const onActiveClickHandler = () =>  props.changeFilter("active") ;

    const onCompletedClickHandler = () => props.changeFilter("completed") ;

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input value={newTaskTitle}
               onChange={ onChangeHandler }
               onKeyPress={ onKeyPressHandler } />
        <button onClick={addNewTask}>+</button>
      </div>
      <ul>
        { liElementDrawer }
      </ul>
      <div>
        <button onClick={ onAllClickHandler }>All</button>
        <button onClick={ onActiveClickHandler}>Active</button>
        <button onClick={ onCompletedClickHandler }>Completed</button>
      </div>
    </div>
  )
}
