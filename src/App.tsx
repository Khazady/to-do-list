import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./components/TodoList/TodoList";

export type FilterValueType = "all" | "active" | "completed";

export type TaskType = {
  id: number,
  title: string,
  isDone: boolean
}

function App() {
  let [tasks, setTasks] = useState([
    {id: 1, title: "HTML&CSS", isDone: true},
    {id: 2, title: "JS", isDone: true},
    {id: 3, title: "ReactJS", isDone: false},
    {id: 4, title: "Rest API", isDone: false},
    {id: 5, title: "GraphQL", isDone: false}
  ]);

  let [filter, setFilter] = useState<FilterValueType>("active");

  function removeTask(id: number) {
    let filteredTasks = tasks.filter(function (task) {
      return task.id !== id
    });
    setTasks(filteredTasks);
  }

  function changeFilter(value: FilterValueType) {
    setFilter(value);
  }

  let tasksForTodoList = tasks;
  if (filter === "active") {
    tasksForTodoList = tasks.filter(function (task) {
      return !task.isDone
    })
  }
  if (filter === "completed") {
    tasksForTodoList = tasks.filter(task => task.isDone)
  }


  return (
    <div className="App">
      <TodoList
        title="What to learn"
        tasks={tasksForTodoList}
        removeTask={removeTask}
        changeFilter={changeFilter}
      />
    </div>
  )
}

export default App;
