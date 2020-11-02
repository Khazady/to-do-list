import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {addTodolistTC, fetchTodolistsTC, TodolistBusinessType} from "./todolists-reducer";
import {Grid, Paper} from "@material-ui/core";
import AddItemForm from "../../components (common)/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";

export const TodolistsList = React.memo(() => {
    const dispatch = useDispatch();

    const todolists = useSelector<AppRootStateType, Array<TodolistBusinessType>>(state => state.todolists)

    //запоминает функцию и т.к. пустой [], то никогда не создавай новую функцию при перерисовке
    //добавляем dispatch в [], просто чтобы реакт не ругался в консоли (disp не меняется и можно было бы его не добавлять)
    const addTodoList = useCallback((title: string) => dispatch(addTodolistTC(title)), [dispatch])

    useEffect(() => {
        //самая первая загрузка листов
        dispatch(fetchTodolistsTC())
    }, [dispatch])

    return (
      <>
          <Grid container style={{padding: "20px"}}>
              <AddItemForm addItem={addTodoList}/>
          </Grid>
          <Grid container spacing={3}>
              {
                  todolists.map(todolist => {

                      return (
                        <Grid item key={todolist.id}>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                  id={todolist.id}
                                  title={todolist.title}
                                  filter={todolist.filter}
                                />
                            </Paper>
                        </Grid>
                      )
                  })
              }
          </Grid>
      </>)
});