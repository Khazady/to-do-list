import React, {useReducer} from 'react';
import './App.css';
import {TodoList} from "./components/TodoList/TodoList";
import {v1} from 'uuid';
import AddItemForm from "./components/AddItemForm/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Menu, Toolbar, Typography, Paper} from "@material-ui/core";
import {
    addTodolistAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./state/store";

export type FilterValueType = "all" | "active" | "completed";

export type TodoListType = {
    id: string
    title: string
    filter: FilterValueType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

function AppWithRedux() {

    const dispatch = useDispatch();
    //первый дженерик тип глобал стейта, второй того, что мы селектим
    const todoLists = useSelector<AppRootState, Array<TodoListType>>(state => state.todolist)

    function changeFilter(id: string, value: FilterValueType) {
        let action = changeTodoListFilterAC(id, value);
        dispatch(action);
    }

    function removeTodoList(id: string) {
        let action = removeTodolistAC(id);
        dispatch(action);
    }

    function changeTodoListTitle(id: string, newTitle: string) {
        let action = changeTodoListTitleAC(id, newTitle);
        dispatch(action)
    }

    function addTodoList(title: string) {
        let action = addTodolistAC(title);
        dispatch(action);
    }


    return (
      <div className="App">
          <AppBar position="static">
              <Toolbar>
                  <IconButton edge="start" color="inherit" aria-label="menu">
                      <Menu open={false}/>
                  </IconButton>
                  <Typography variant="h6">
                      News
                  </Typography>
                  <Button color="inherit">Login</Button>
              </Toolbar>
          </AppBar>
          <Container fixed>
              <Grid container style={{padding: "20px"}}>
                  <AddItemForm addItem={addTodoList}/>
              </Grid>
              <Grid container spacing={3}>
                  {
                      todoLists.map(todoList => {

                          return (
                            <Grid item>
                                <Paper style={{padding: "10px"}}>
                                    <TodoList
                                      key={todoList.id}
                                      id={todoList.id}
                                      title={todoList.title}
                                      changeFilter={changeFilter}
                                      filter={todoList.filter}
                                      removeTodoList={removeTodoList}
                                      changeTodoListTitle={changeTodoListTitle}
                                    />
                                </Paper>
                            </Grid>
                          )})
                  }
              </Grid>
          </Container>
      </div>
    )
}

export default AppWithRedux;
