import React, {useCallback, useEffect} from 'react'
import {Button, ButtonGroup, IconButton} from "@material-ui/core";
import {Delete, Home} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../../app/store";
import {addTaskTC, fetchTasksTC} from "../tasks-reducer";
import {
    changeTodoListFilterAC,
    changeTodolistTitleTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistBusinessType
} from "../todolists-reducer";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/api";
import AddItemForm from "../../../components (common)/AddItemForm/AddItemForm";
import EditableSpan from "../../../components (common)/EditableSpan/EditableSpan";

type TodoListPropsType = {
    todolist: TodolistBusinessType

    //for storybook
    demo?: boolean
}
//demo default value false (if (typeof demo === 'undefined') )
export const Todolist = React.memo( ( {demo = false, ...props}: TodoListPropsType) => {

    console.log("Todolist is called")
    const dispatch = useDispatch()


    //первый дженерик тип глобал стейта, второй того, что мы селектим
    //вместо mapStateToProps, храним здесь стейт, нужный для этой компоненты
    const allTodoListTasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.todolist.id])

    //в неё кладем отсортированные таски (создаем тут, чтобы не создавать в каждом case)
    //let потому что делаем ниже присваивания
    let tasksForTodoList: Array<TaskType>;
    switch (props.todolist.filter) {
        case "active" :
            tasksForTodoList = allTodoListTasks.filter(task => task.status === TaskStatuses.New)
            break;
        case "completed" :
            tasksForTodoList = allTodoListTasks.filter(task => task.status === TaskStatuses.Completed)
            break;
        default :
            tasksForTodoList = allTodoListTasks;
            break;
    }

    //запоминает функцию и т.к. пустой [], то никогда не создавай новую функцию
    //disp и AC не меняется и можно его не добавлять
    //обязательно вставляем всё, от чего зависит функция извне (props.id)
    const addTask = useCallback((title: string) => dispatch(addTaskTC(props.todolist.id, title)), [dispatch, props.todolist.id]);
    const removeTodoList = useCallback(() => dispatch(removeTodolistTC(props.todolist.id)), [dispatch, props.todolist.id]);
    const changeTodoListTitle = useCallback((newTitle: string) => {
        const thunk = changeTodolistTitleTC(props.todolist.id, newTitle);
        dispatch(thunk)
    }, [dispatch, props.todolist.id]);
    //предполагаем, что в Button от MatUI внутри тоже есть React.memo, поэтому оборачиваем передаваемых в них коллбэк в useCallback
    const changeFilter = useCallback((id: string, filter: FilterValuesType) =>
      dispatch(changeTodoListFilterAC({todolistId: props.todolist.id, filter})), [dispatch, props.todolist.id]);


    useEffect(() => {
        //убираем из storybook работу с сервером (после ретурна код не выполняется)
        if(demo) return
        dispatch(fetchTasksTC(props.todolist.id))
    }, [dispatch, props.todolist.id])

    return (
        <div>
            <h3>
                <EditableSpan title={props.todolist.title} onChange={changeTodoListTitle} disabled={props.todolist.entityStatus === 'loading'}/>
                <IconButton onClick={removeTodoList} disabled={props.todolist.entityStatus === "loading"}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === "loading"}/>
            <ul>
                {tasksForTodoList.map(task =>
                    <Task
                        task={task}
                        filter={props.todolist.filter}
                        todolistId={props.todolist.id}
                        key={task.id}
                        disabled={props.todolist.entityStatus === "loading"}
                    />)}
            </ul>
            <div>
                <ButtonGroup>
                    <Button onClick={() => changeFilter(props.todolist.id, "all")}
                            variant={props.todolist.filter === "all" ? "contained" : "outlined"}
                            color="primary" endIcon={<Home/>}>All</Button>
                    <Button onClick={() => changeFilter(props.todolist.id, "active")}
                            variant={props.todolist.filter === "active" ? "contained" : "outlined"}
                            color="inherit">Active</Button>
                    <Button onClick={() => changeFilter(props.todolist.id, "completed")}
                            variant={props.todolist.filter === "completed" ? "contained" : "outlined"}
                            color="secondary">Completed</Button>
                </ButtonGroup>
            </div>
        </div>
    )
});


