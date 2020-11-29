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
    removeTodolistTC
} from "../todolists-reducer";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/api";
import AddItemForm from "../../../components (common)/AddItemForm/AddItemForm";
import EditableSpan from "../../../components (common)/EditableSpan/EditableSpan";
import {RequestStatusType} from "../../../app/app-reducer";

type TodoListPropsType = {
    id: string
    title: string
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const Todolist = React.memo((props: TodoListPropsType) => {
    console.log("Todolist is called")
    const dispatch = useDispatch()


    //первый дженерик тип глобал стейта, второй того, что мы селектим
    //вместо mapStateToProps, храним здесь стейт, нужный для этой компоненты
    const allTodoListTasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.id])

    //в неё кладем отсортированные таски (создаем тут, чтобы не создавать в каждом case)
    //let потому что делаем ниже присваивания
    let tasksForTodoList: Array<TaskType>;
    switch (props.filter) {
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
    const addTask = useCallback((title: string) => dispatch(addTaskTC(props.id, title)), [dispatch, props.id]);
    const removeTodoList = useCallback(() => dispatch(removeTodolistTC(props.id)), [dispatch, props.id]);
    const changeTodoListTitle = useCallback((newTitle: string) => {
        const thunk = changeTodolistTitleTC(props.id, newTitle);
        dispatch(thunk)
    }, [dispatch, props.id]);
    //предполагаем, что в Button от MatUI внутри тоже есть React.memo, поэтому оборачиваем передаваемых в них коллбэк в useCallback
    const changeFilter = useCallback((id: string, value: FilterValuesType) => dispatch(changeTodoListFilterAC(props.id, value)), [dispatch, props.id]);


    useEffect(() => {
        dispatch(fetchTasksTC(props.id))
    }, [dispatch, props.id])

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} onChange={changeTodoListTitle}/>
                <IconButton onClick={removeTodoList} disabled={props.entityStatus === "loading"}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={props.entityStatus === "loading"}/>
            <ul>
                {tasksForTodoList.map(task =>
                    <Task
                        task={task}
                        filter={props.filter}
                        todolistId={props.id}
                        key={task.id}
                    />)}
            </ul>
            <div>
                <ButtonGroup>
                    <Button onClick={() => changeFilter(props.id, "all")}
                            variant={props.filter === "all" ? "contained" : "outlined"}
                            color="primary" endIcon={<Home/>}>All</Button>
                    <Button onClick={() => changeFilter(props.id, "active")}
                            variant={props.filter === "active" ? "contained" : "outlined"}
                            color="inherit">Active</Button>
                    <Button onClick={() => changeFilter(props.id, "completed")}
                            variant={props.filter === "completed" ? "contained" : "outlined"}
                            color="secondary">Completed</Button>
                </ButtonGroup>
            </div>
        </div>
    )
});


