import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./components/TodoList/TodoList";
import {v1} from 'uuid';

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
    switch (filter) {
        case "active" :
            tasksForTodoList = tasks.filter(task => !task.isDone)
            break;
        case "completed" :
            tasksForTodoList = tasks.filter(task => task.isDone)
            break;
        default :
            tasksForTodoList = tasks;
            break;
    }

    function addTask(title: string) {
        let newTask = {id: v1(), title: title, isDone: false}
        let newTasks = [newTask, ...tasks];
        setTasks(newTasks)
    }

    function changeStatus(id: string, isDone: boolean) {
        let task = tasks.find(task => task.id === id)
        if (task) {
            task.isDone = isDone;
            setTasks([...tasks])  /*обязательно ложим КАК-БЫ новый массив, чтобы перерисовка сработала*/
        }}


    return (
      <div className="App">
          <TodoList
            title="What to learn"
            tasks={tasksForTodoList}
            removeTask={removeTask}
            changeFilter={changeFilter}
            addTask={addTask}
            changeStatus={changeStatus}
            filter={filter}
          />
      </div>
    )
}

export default App;
