import React, {useCallback} from 'react';
import './App.css';
import {TodoList} from "./components/TodoList/TodoList";
import AddItemForm from "./components/AddItemForm/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Menu, Toolbar, Typography, Paper} from "@material-ui/core";
import {
    addTodolistAC,
} from "./state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./state/store";

export type FilterValueType = "all" | "active" | "completed";
export type TodoListType = {
    id: string
    title: string
    filter: FilterValueType
}


function AppWithRedux() {
    console.log("AppWithRedux is called")

    //вместо mapDispatchToProps
    const dispatch = useDispatch();

    //первый дженерик тип глобал стейта, второй того, что мы селектим
    const todoLists = useSelector<AppRootState, Array<TodoListType>>(state => state.todolist)

    //запоминает функцию и т.к. пустой [], то никогда не создавай новую функцию при перерисовке
    //добавляем dispatch в [], просто чтобы реакт не ругался в консоли (disp не меняется и можно было бы его не добавлять)
    const addTodoList = useCallback( (title: string) => dispatch(addTodolistAC(title)), [dispatch])


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
                            <Grid item key={todoList.id}>
                                <Paper style={{padding: "10px"}}>
                                    <TodoList
                                      id={todoList.id}
                                      title={todoList.title}
                                      filter={todoList.filter}
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
