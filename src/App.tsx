import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./components/TodoList/TodoList";
import { v1 } from 'uuid';

export type FilterValueType = "all" | "active" | "completed";

export type TaskType = {
  id: string,
  title: string,
  isDone: boolean
}

function App() {
  let [tasks, setTasks] = useState<Array<TaskType>>([
    {id: v1(), title: "HTML&CSS", isDone: true},
    {id: v1(), title: "JS", isDone: true},
    {id: v1(), title: "ReactJS", isDone: false},
    {id: v1(), title: "Rest API", isDone: false},
    {id: v1(), title: "GraphQL", isDone: false}
  ]);

  let [filter, setFilter] = useState<FilterValueType>("all");

  function removeTask(id: string) {
    let filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
  }

  function changeFilter(value: FilterValueType) {
    setFilter(value);
  }

  let tasksForTodoList: Array<TaskType>;
  filter === "active" ? tasksForTodoList = tasks.filter(task =>!task.isDone) :
  filter === "completed" ? tasksForTodoList = tasks.filter(task => task.isDone) : tasksForTodoList = tasks

    function addTask(title: string) {
      let newTask = {id: v1(), title: title, isDone: false}
      let newTasks = [newTask, ...tasks];
      setTasks(newTasks)
    }


  return (
    <div className="App">
      <TodoList
        title="What to learn"
        tasks={tasksForTodoList}
        removeTask={removeTask}
        changeFilter={changeFilter}
        addTask={addTask}
      />
    </div>
  )
}

export default App;
