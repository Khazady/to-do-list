import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
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
    const todolists = useSelector<AppRootStateType, Array<TodolistBusinessType>>(state => state.todolists)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    //запоминает функцию и т.к. пустой [], то никогда не создавай новую функцию при перерисовке
    //добавляем dispatch в [], просто чтобы реакт не ругался в консоли (disp не меняется и можно было бы его не добавлять)
    const addTodoList = useCallback((title: string) => dispatch(addTodolistTC(title)), [dispatch])

    useEffect(() => {
        //убираем из storybook работу с сервером (после ретурна код не выполняется)
        //а также не посылаем запрос на серв когда чел не залогинен
        if(demo || !isLoggedIn) return
        //самая первая загрузка листов
        dispatch(fetchTodolistsTC())
    }, [dispatch])

    //если не залогинен и находишься на странице тудулистов, то редирект на логин
    //делаем в самом конце, чтобы хуки выше не попадали под else(хуки нельзя в условиях и циклах)
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