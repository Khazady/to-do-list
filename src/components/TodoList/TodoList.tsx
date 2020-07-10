import React, {ChangeEvent} from 'react'
import {TaskType} from "../../App";
import {FilterValueType} from "../../App";
import AddItemForm from "../AddItemForm/AddItemForm";
import EditableSpan from '../EditableSpan/EditableSpan';
import {Checkbox, ButtonGroup, Button, IconButton} from "@material-ui/core";
import {Delete, Home} from "@material-ui/icons";

type TodoListPropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, todoList: string) => void
    changeFilter: (id: string, value: FilterValueType) => void
    addTask: (title: string, todoListID: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todoListID: string) => void
    changeTaskTitle: (id: string, newTitle: string, todoListID: string) => void
    filter: FilterValueType
    removeTodoList: (id: string) => void
    changeTodoListTitle: (id: string, newTitle: string) => void
}

export function TodoList(props: TodoListPropsType) {
    /*отрисовываем лишки мапом*/
    const liElementsDrawer = props.tasks.map((task) => {
        const onRemoveHandler = () => {
            props.removeTask(task.id, props.id)
        };
        const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = e.currentTarget.checked;
            props.changeTaskStatus(task.id, newIsDoneValue, props.id);
        }
        const onChangeTitleHandler = (newValue: string) => {
            props.changeTaskTitle(task.id, newValue, props.id);
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

    //оберётка для стыковки интерфейсов addTask и addItem в AddItemForm (она примет только тайтл, а коллбек здесь достанет
    //из пропсов айдишник тудулиста и передаст наверх оба значения
    const addTask = (title: string) => props.addTask(title, props.id)

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
