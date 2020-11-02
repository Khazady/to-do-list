import React, {useCallback, useEffect} from 'react'
import {Button, ButtonGroup, Grid, IconButton, Paper} from "@material-ui/core";
import {Delete, Home} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {addTaskTC, fetchTasksTC} from "../../state/tasks-reducer";
import {
    addTodolistTC,
    changeTodoListFilterAC,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistBusinessType
} from "../../state/todolists-reducer";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../api/api";
import AddItemForm from '../../components (common)/AddItemForm/AddItemForm';
import EditableSpan from "../../components (common)/EditableSpan/EditableSpan";

type TodolistsPropsType = {}

export const Todolists = React.memo((props: TodolistsPropsType) => {
    const dispatch = useDispatch()
    //первый дженерик тип глобал стейта, второй того, что мы селектим
    const todolists = useSelector<AppRootStateType, Array<TodolistBusinessType>>(state => state.todolists)

    //запоминает функцию и т.к. пустой [], то никогда не создавай новую функцию при перерисовке
    //добавляем dispatch в [], просто чтобы реакт не ругался в консоли (disp не меняется и можно было бы его не добавлять)
    const addTodoList = useCallback( (title: string) => dispatch(addTodolistTC(title)), [dispatch])

    return <>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={addTodoList}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(todolist => {
                    useEffect(() => {
                        dispatch(fetchTasksTC(todolist.id))
                    }, [dispatch, todolist.id])
                    const allTodolistTasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[todolist.id])
                    //в неё кладем отсортированные таски (создаем тут, чтобы не создавать в каждом case)
                    //let потому что делаем ниже присваивания
                    let tasksForTodolist: Array<TaskType>;
                    switch (todolist.filter) {
                        case "active" :
                            tasksForTodolist = allTodolistTasks.filter(task => task.status === TaskStatuses.New)
                            break;
                        case "completed" :
                            tasksForTodolist = allTodolistTasks.filter(task => task.status === TaskStatuses.Completed)
                            break;
                        default :
                            tasksForTodolist = allTodolistTasks;
                            break;
                    }
                    //запоминает функцию и т.к. пустой [], то никогда не создавай новую функцию
                    //disp и AC не меняется и можно его не добавлять
                    //обязательно вставляем всё, от чего зависит функция извне (props.id)
                    const addTask = useCallback((title: string) => dispatch(addTaskTC(todolist.id, title)), [dispatch, todolist.id]);
                    const removeTodoList = useCallback(() => dispatch(removeTodolistTC(todolist.id)), [dispatch, todolist.id]);
                    const changeTodoListTitle = useCallback((newTitle: string) => {
                        const thunk = changeTodolistTitleTC(todolist.id, newTitle);
                        dispatch(thunk)
                    }, [dispatch, todolist.id]);
                    //предполагаем, что в Button от MatUI внутри тоже есть React.memo, поэтому оборачиваем передаваемых в них коллбэк в useCallback
                    const changeFilter = useCallback((id: string, value: FilterValuesType) => dispatch(changeTodoListFilterAC(todolist.id, value)), [dispatch, todolist.id]);
                    return (
                      <Grid item key={todolist.id}>
                          <Paper style={{padding: "10px"}}>
                              <h3>
                                  <EditableSpan title={todolist.title} onChange={changeTodoListTitle}/>
                                  <IconButton onClick={removeTodoList}>
                                      <Delete/>
                                  </IconButton>
                              </h3>
                              <AddItemForm addItem={addTask}/>
                              <ul>
                                  {tasksForTodolist.map(task =>
                                    <Task
                                      task={task}
                                      filter={todolist.filter}
                                      todolistId={todolist.id}
                                      key={task.id}
                                    />)}
                              </ul>
                              <div>
                                  <ButtonGroup>
                                      <Button onClick={() => changeFilter(todolist.id, "all")}
                                              variant={todolist.filter === "all" ? "contained" : "outlined"}
                                              color="primary" endIcon={<Home/>}>All</Button>
                                      <Button onClick={() => changeFilter(todolist.id, "active")}
                                              variant={todolist.filter === "active" ? "contained" : "outlined"}
                                              color="inherit">Active</Button>
                                      <Button onClick={() => changeFilter(todolist.id, "completed")}
                                              variant={todolist.filter === "completed" ? "contained" : "outlined"}
                                              color="secondary">Completed</Button>
                                  </ButtonGroup>
                              </div>
                          </Paper>
                      </Grid>
                    )
                })
            }
        </Grid>
    </>
});


