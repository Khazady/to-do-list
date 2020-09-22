import React, {ChangeEvent} from 'react'
import {TaskType, FilterValueType} from "../../AppWithRedux";
import AddItemForm from "../AddItemForm/AddItemForm";
import EditableSpan from '../EditableSpan/EditableSpan';
import {Checkbox, ButtonGroup, Button, IconButton} from "@material-ui/core";
import {Delete, Home} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "../../state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../../state/tasks-reducer";

type TodoListPropsType = {
    id: string
    title: string
    changeFilter: (id: string, value: FilterValueType) => void
    filter: FilterValueType
    removeTodoList: (id: string) => void
    changeTodoListTitle: (id: string, newTitle: string) => void
}

export function TodoList(props: TodoListPropsType) {
    const dispatch = useDispatch()
    const tasks = useSelector<AppRootState, Array<TaskType>>(state => state.tasks[props.id])

    let allTodoListTasks = tasks;
    let tasksForTodoList: Array<TaskType> = allTodoListTasks;
    switch (props.filter) {
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
    /*отрисовываем лишки мапом*/
    const liElementsDrawer = tasksForTodoList.map((task) => {
        const onRemoveHandler = () => {
            dispatch(removeTaskAC(task.id, props.id))
        };
        const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = e.currentTarget.checked;
            dispatch(changeTaskStatusAC(task.id, newIsDoneValue, props.id));
        }
        const onChangeTitleHandler = (newValue: string) => {
            dispatch(changeTaskTitleAC(task.id, newValue, props.id))
        }
        return (
          <li key={task.id} className={props.filter !== "completed" && task.isDone ? "is-done" : ""}>
              {/*прозрачный класс добавится когда таска чекнута и не в фильтре комплитед*/}
              <Checkbox checked={task.isDone} onChange={onChangeStatusHandler} color="primary"/>
              <EditableSpan title={task.title} onChange={onChangeTitleHandler}/>
              <IconButton onClick={onRemoveHandler}>
                  <Delete/>
              </IconButton>
          </li>
        )
    })

    /*Вынесли функции кнопок фильтрации*/
    const onAllClickHandler = () => props.changeFilter(props.id, "all");
    const onActiveClickHandler = () => props.changeFilter(props.id, "active");
    const onCompletedClickHandler = () => props.changeFilter(props.id, "completed");
    const removeTodoList = () => props.removeTodoList(props.id);
    const changeTodoListTitle = (newTitle: string) => props.changeTodoListTitle(props.id, newTitle);
    const addTask = (title: string) => { dispatch(addTaskAC(props.id, title)) }

    return (
      <div>
          <h3>
              <EditableSpan title={props.title} onChange={changeTodoListTitle}/>
              <IconButton onClick={removeTodoList}>
                  <Delete/>
              </IconButton>
          </h3>
          <AddItemForm addItem={addTask}/>
          <ul>
              {liElementsDrawer}
          </ul>
          <div>
              <ButtonGroup>
                  <Button onClick={onAllClickHandler}
                          variant={props.filter === "all" ? "contained" : "outlined"}
                          color="primary" endIcon={<Home/>}>All</Button>
                  <Button onClick={onActiveClickHandler} variant={props.filter === "active" ? "contained" : "outlined"}
                          color="inherit">Active</Button>
                  <Button onClick={onCompletedClickHandler}
                          variant={props.filter === "completed" ? "contained" : "outlined"}
                          color="secondary">Completed</Button>
              </ButtonGroup>
          </div>
      </div>
    )
}
