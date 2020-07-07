import React, {ChangeEvent} from 'react'
import {TaskType} from "../../App";
import {FilterValueType} from "../../App";
import AddItemForm from "../AddItemForm/AddItemForm";
import EditableSpan from '../EditableSpan/EditableSpan';
import {IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Button} from "@material-ui/core";

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
  removeTodoList: (id:string) => void
  changeTodoListTitle: (id: string, newTitle: string) => void
}

export function TodoList(props: TodoListPropsType) {
    /*отрисовываем лишки мапом*/
    const liElementsDrawer = props.tasks.map((task) => {
        const onRemoveHandler = () => {props.removeTask(task.id, props.id)};
        const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = e.currentTarget.checked;
            props.changeTaskStatus(task.id, newIsDoneValue, props.id);
        }
        const onChangeTitleHandler = (newValue: string) => {
            props.changeTaskTitle(task.id, newValue, props.id);
        }
        return (
          <li key={task.id} className={props.filter !== "completed" && task.isDone ? "is-done" : "" }>
          {/*прозрачный класс добавится когда таска чекнута и не в фильтре комплитед*/}
              <input type="checkbox" checked={task.isDone} onChange={onChangeStatusHandler}/>
              <EditableSpan title={task.title} onChange={onChangeTitleHandler} />
              <button onClick={ onRemoveHandler }>×</button>
          </li>
        )
    })

    /*Вынесли функции кнопок фильтрации*/
    const onAllClickHandler = () => props.changeFilter(props.id, "all") ;
    const onActiveClickHandler = () =>  props.changeFilter(props.id, "active") ;
    const onCompletedClickHandler = () => props.changeFilter(props.id, "completed") ;
    const removeTodoList = () => props.removeTodoList(props.id) ;
    const changeTodoListTitle = (newTitle: string) => props.changeTodoListTitle(props.id, newTitle) ;

    //оберётка для стыковки интерфейсов addTask и addItem в AddItemForm (она примет только тайтл, а коллбек здесь достанет
    //из пропсов айдишник тудулиста и передаст наверх оба значения
    const addTask = (title: string) => props.addTask(title, props.id)

  return (
    <div>
      <h3>
          <EditableSpan title={props.title} onChange={changeTodoListTitle}/>
          <button onClick={ removeTodoList }>X</button>
          <IconButton onClick={ removeTodoList } >
            <Delete/>
          </IconButton>
      </h3>
      <AddItemForm addItem={addTask}/>
      <ul>
        { liElementsDrawer }
      </ul>
      <div>
        <Button onClick={ onAllClickHandler } className={props.filter === "all" ? "active-filter" : ""}>All</Button>
        <Button onClick={ onActiveClickHandler} className={props.filter === "active" ? "active-filter" : ""}>Active</Button>
        <Button onClick={ onCompletedClickHandler } className={props.filter === "completed" ? "active-filter" : ""}>Completed</Button>
      </div>
    </div>
  )
}
