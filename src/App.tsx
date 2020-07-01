import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./components/TodoList/TodoList";
import {v1} from 'uuid';
import AddItemForm from "./components/AddItemForm/AddItemForm";

export type FilterValueType = "all" | "active" | "completed";

type TodoListType = {
    id: string
    title: string
    filter: FilterValueType
}

type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

function App() {

    let todoListID1 = v1();
    let todoListID2 = v1();

    let [todoLists, setTodoList] = useState <Array<TodoListType>>([
        {id: todoListID1, title: "Books", filter: "all"},
        {id: todoListID2, title: "Songs", filter: "all"},
    ])

    let [tasks, setTasks] = useState<TasksStateType> ({
      // Запись [todoListID1] создает такой ключ
        [todoListID1]: [
        {id: v1(), title: "HTML&CSS", isDone: true},
        {id: v1(), title: "JS", isDone: true},
        {id: v1(), title: "ReactJS", isDone: false},
    ],
      [todoListID2]: [
        {id: v1(), title: "Rest API", isDone: false},
        {id: v1(), title: "GraphQL", isDone: false}
        ]
});

    function removeTask(id: string, todoListID: string) {
        let todoListTasks = tasks[todoListID]; //достаем массив тасок одного тудулиста из объекта тудулистОВ
        tasks[todoListID] = todoListTasks.filter(task => task.id !== id); //перезаписываем таски, кот. достали, отфильтрованными тасками
        setTasks({...tasks}); //пихаем в реакт якобы новые таски
    }

    function changeFilter(id: string, value: FilterValueType) {
        let todoList = todoLists.find(todoList => todoList.id === id);
        if(todoList) {
            todoList.filter = value
            setTodoList([...todoLists])
        }
    }

    function addTask(title: string, todoListID: string) {
        let newTask = {id: v1(), title: title, isDone: false}
        let todoListTasks = tasks[todoListID];
        tasks[todoListID] = [newTask, ...todoListTasks]
        setTasks({...tasks})
    }

    function changeTaskStatus(id: string, isDone: boolean, todoListID: string) {
        let todoListTasks = tasks[todoListID];
        let task = todoListTasks.find(task => task.id === id)
        if (task) {
            task.isDone = isDone;
            setTasks({...tasks})  /*обязательно ложим КАК-БЫ новый массив, чтобы перерисовка сработала*/
        }}

    function changeTaskTitle(id: string, newTitle: string, todoListID: string) {
        //достанем нужный массив по TodoListID
        let todoListTasks = tasks[todoListID];
        //найдем нужную таску
        let task = todoListTasks.find(task => task.id === id)
        //изменим таску если нашлась
        if (task) {
            task.title = newTitle;
            setTasks({...tasks})  /*обязательно ложим КАК-БЫ новый массив, чтобы перерисовка сработала*/
        }}

    function removeTodoList(id: string) {
        let filteredTodoList = todoLists.filter(tl => tl.id !== id);
        setTodoList(filteredTodoList);
        delete tasks[id]; //нет смысла хранить массив тасок тудулиста, которого уже нету, поэтому удаляем
        setTasks(tasks)
    }

    function changeTodoListTitle(id: string, newTitle: string) {
        //находим нудный тудулист
        let todoList = todoLists.filter(tl => tl.id === id);
        if(todoList) {
            debugger
            todoList[0].title = newTitle //какой-то кал!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            setTodoList([...todoLists]);
        }
    }
    
    function addTodoList(title: string) {
        //новый тудулист
        let newTodoListID = v1();
        let newTodoList: TodoListType = {id: newTodoListID, title: title, filter: "all"}
        setTodoList([newTodoList, ...todoLists]);
        //новые таски
        setTasks({
          ...tasks,
            [newTodoListID]: []
        })
    }


    return (
      <div className="App">
          <AddItemForm addItem={addTodoList}/>
          {todoLists.map(todoList => {
              let allTodoListTasks = tasks[todoList.id];
              let tasksForTodoList: Array<TaskType> = allTodoListTasks;
              switch (todoList.filter) {
                  case "active" :
                      tasksForTodoList = allTodoListTasks.filter(task => !task.isDone)
                      break;
                  case "completed" :
                      tasksForTodoList = allTodoListTasks.filter(task => task.isDone)
                      break;
                  default :
                      tasksForTodoList = allTodoListTasks;
                      break;
              }

              return (
                <TodoList
                  key={todoList.id}
                  id={todoList.id}
                  title={todoList.title}
                  tasks={tasksForTodoList}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeTaskStatus}
                  changeTaskTitle={changeTaskTitle}
                  filter={todoList.filter}
                  removeTodoList={removeTodoList}
                  changeTodoListTitle={changeTodoListTitle}
                />
              )
          })}
      </div>
    )
}

export default App;
