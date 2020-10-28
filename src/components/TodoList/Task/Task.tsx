import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../../../state/tasks-reducer";
import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import EditableSpan from "../../EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {FilterValuesType} from "../../../state/todolists-reducer";
import {TaskStatuses, TaskType} from "../../../api/api";

type TaskPropsType = {
    task: TaskType
    filter: FilterValuesType
    todolistId: string

}
export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch();

    const RemoveTask = useCallback(() =>
        dispatch(removeTaskAC(props.task.id, props.todolistId)),
        //массив зависимостей (все, что используем извне)
        [dispatch, props.task.id, props.todolistId]);
    const ChangeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newStatusValue = e.currentTarget.checked;
        dispatch(changeTaskStatusAC(props.task.id, newStatusValue ? TaskStatuses.Completed : TaskStatuses.New, props.todolistId));
    }, [dispatch, props.task.id, props.todolistId]);
    const ChangeTaskTitle = useCallback((newValue: string) =>
        dispatch(changeTaskTitleAC(props.task.id, newValue, props.todolistId)),
        [dispatch, props.task.id, props.todolistId]);

    return (
        <li key={props.task.id} className={props.filter !== "completed" && props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
            {/*прозрачный класс добавится когда таска чекнута и не в фильтре комплитед*/}
            <Checkbox checked={props.task.status === TaskStatuses.Completed} onChange={ChangeTaskStatus} color="primary"/>
            <EditableSpan title={props.task.title} onChange={ChangeTaskTitle}/>
            <IconButton onClick={RemoveTask}>
                <Delete/>
            </IconButton>
        </li>
    )
});