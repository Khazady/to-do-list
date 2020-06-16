import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import {TaskType} from "../../App";
import {FilterValueType} from "../../App";

type TodoListPropsType = {
  title: string
  tasks: Array<TaskType>
  removeTask: (id: string) => void
  changeFilter: (value: FilterValueType) => void
  addTask: (title: string) => void
  changeStatus: (id: string, isDone: boolean) => void
  filter: FilterValueType
}

export function TodoList(props: TodoListPropsType) {

    /*локальный стейт инпута, синхронизируем value инпута с отрисовкой по клику новой таски в title*/
    const [newTaskTitle, setNewTaskTitle] = useState<string>("");

    let [error, setError] = useState<string | null>(null)


    /*перерисовка инпута, засовываем в локал стейт впечатанное значение инпута и убираем ошибку, впечатывая*/
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value);
        setError(null);
    };

    /*если нажат интер, то пихнуть в App*/
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        e.charCode === 13 && addNewTask()
    }


    /*пихает из локального стейта в функцию addTask в App*/
    const addNewTask = () => {
        if(newTaskTitle.trim() !== "") {   /* метод трим удаляет пробелы, юзер не сможет добавить таску из пробелов*/
            props.addTask(newTaskTitle);
            setNewTaskTitle("")
        } else {
            setError("Title is not required") /* если после трима в строке ничего не осталось, то в стейт залетит текст ошибки*/
        }
    };

    /*отрисовываем лишки мапом*/
    const liElementsDrawer = props.tasks.map((task) => {
        const onRemoveHandler = () => {props.removeTask(task.id)};
        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = e.currentTarget.checked;
            props.changeStatus(task.id, newIsDoneValue);
        }
        return (
          <li key={task.id} className={props.filter !== "completed" && task.isDone ? "is-done" : "" }>
          {/*прозрачный класс добавится когда таска чекнута и не в фильтре комплитед*/}
              <input type="checkbox" checked={task.isDone} onChange={onChangeHandler}/>
              <span>{task.title}</span>
              <button onClick={ onRemoveHandler }>×</button>
          </li>
        )
    })

    /*Вынесли функции кнопок фильтрации*/
    const onAllClickHandler = () => props.changeFilter("all") ;

    const onActiveClickHandler = () =>  props.changeFilter("active") ;

    const onCompletedClickHandler = () => props.changeFilter("completed") ;

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input value={newTaskTitle}
               onChange={ onChangeHandler }
               onKeyPress={ onKeyPressHandler }
               className={error ? "error" : ""}/> {/*если ошибка то класс error, нет - пустой класснейм*/}
        <button onClick={addNewTask}>+</button>
          {error && <div className="error-message">{error}</div> }  {/* если есть ошибка, то отрисовываем*/}
      </div>
      <ul>
        { liElementsDrawer }
      </ul>
      <div>
        <button onClick={ onAllClickHandler } className={props.filter === "all" ? "active-filter" : ""}>All</button>
        <button onClick={ onActiveClickHandler} className={props.filter === "active" ? "active-filter" : ""}>Active</button>
        <button onClick={ onCompletedClickHandler } className={props.filter === "completed" ? "active-filter" : ""}>Completed</button>
      </div>
    </div>
  )
}
