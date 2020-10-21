import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, TaskType} from "../../../state/tasks-reducer";
import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import EditableSpan from "../../EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {FilterValueType} from "../../../AppWithRedux";

type TaskPropsType = {
    task: TaskType
    filter: FilterValueType
    todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch();

    const onRemoveHandler = useCallback(() =>
        dispatch(removeTaskAC(props.task.id, props.todolistId)),
        //массив зависимостей (все, что используем извне)
        [props.task.id, props.todolistId]);
    const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        dispatch(changeTaskStatusAC(props.task.id, newIsDoneValue, props.todolistId));
    }, [props.task.id, props.todolistId]);
    const onChangeTitleHandler = useCallback((newValue: string) =>
        dispatch(changeTaskTitleAC(props.task.id, newValue, props.todolistId)),
        [props.task.id, props.todolistId]);

    return (
        <li key={props.task.id} className={props.filter !== "completed" && props.task.isDone ? "is-done" : ""}>
            {/*прозрачный класс добавится когда таска чекнута и не в фильтре комплитед*/}
            <Checkbox checked={props.task.isDone} onChange={onChangeStatusHandler} color="primary"/>
            <EditableSpan title={props.task.title} onChange={onChangeTitleHandler}/>
            <IconButton onClick={onRemoveHandler}>
                <Delete/>
            </IconButton>
        </li>
    )
});