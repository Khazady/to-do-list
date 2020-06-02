import React from "react";
import {TaskType} from "../../App";
import {FilterValueType} from "../../App";


type TodoListPropsType = {
  title: string
  tasks: Array<TaskType>
  removeTask: (id: number) => void
  changeFilter: (value: FilterValueType) => void
}

export function TodoList(props: TodoListPropsType) {
  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input/>
        <button>+</button>
      </div>
      <ul>
        {
          props.tasks.map((task) => {
            return (
              <li key={task.id}>
                <input type="checkbox" checked={task.isDone}/>
                <span>{task.title}</span>
                <button onClick={() => {props.removeTask(task.id)}}>×</button>
              </li>
            )
          })
        }
      </ul>
      <div>
        <button onClick={() => {
          props.changeFilter("all")
        }}>All
        </button>
        <button onClick={() => {
          props.changeFilter("active")
        }}>Active
        </button>
        <button onClick={() => {
          props.changeFilter("completed")
        }}>Completed
        </button>
      </div>
    </div>
  )
}
