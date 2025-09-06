import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../app/store";
import {addTodolistTC, fetchTodolistsTC, TodolistBusinessType} from "./todolists-reducer";
import {Grid, Paper} from "@material-ui/core";
import AddItemForm from "../../components (common)/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import { Redirect } from "react-router-dom";

//for storybook
type PropsType = {demo?:boolean}

//demo default value false (if (typeof demo === 'undefined') )
export const TodolistsList: React.FC<PropsType> = React.memo(({demo=false}) => {
    const dispatch = useDispatch();
    const todolists = useSelector<RootStateType, Array<TodolistBusinessType>>(state => state.todolists)
    const isLoggedIn = useSelector<RootStateType, boolean>(state => state.auth.isLoggedIn)

    // memoizes the function; with empty [], it never creates a new function on re-renders
    // add dispatch to [] just to avoid React warnings in the console (dispatch doesn't change so it could be omitted)
    const addTodoList = useCallback((title: string) => dispatch(addTodolistTC(title)), [dispatch])

    useEffect(() => {
        // remove server interaction from storybook (code after return doesn't execute)
        // and don't send request to server when user isn't logged in
        if(demo || !isLoggedIn) return
        // the very first loading of lists
        dispatch(fetchTodolistsTC())
    }, [dispatch])

    // if not logged in and on the todolists page, redirect to login
    // place this at the end to keep hooks above out of else (hooks can't be inside conditions or loops)
    if(!isLoggedIn) {
        return <Redirect to={'/login'}/>
    }

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
                                  todolist={todolist}

                                  demo={demo}
                                />
                            </Paper>
                        </Grid>
                      )
                  })
              }
          </Grid>
      </>)
});