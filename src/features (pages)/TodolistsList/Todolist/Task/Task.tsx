import {useDispatch} from "react-redux";
import {deleteTaskTC, updateTaskTC} from "../../tasks-reducer";
import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {FilterValuesType} from "../../todolists-reducer";
import {TaskStatuses, TaskType} from "../../../../api/api";
import EditableSpan from "../../../../components (common)/EditableSpan/EditableSpan";

type TaskPropsType = {
    task: TaskType
    filter: FilterValuesType
    todolistId: string
    // disable simultaneously in TL; could be otherwise but no UX engineer :)
    disabled?: boolean
}
export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch();

    const RemoveTask = useCallback(() => {
        dispatch(deleteTaskTC({todolistId: props.todolistId, taskId: props.task.id}))
        },
        // dependency array (all external values used)
        [dispatch, props.task.id, props.todolistId]);
    const ChangeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newStatusValue = e.currentTarget.checked;
        // send only the property we need to change in the model
        dispatch(updateTaskTC({todolistId: props.todolistId, taskId: props.task.id, model: {status: newStatusValue ? TaskStatuses.Completed : TaskStatuses.New}}));
    }, [dispatch, props.task.id, props.todolistId]);
    const ChangeTaskTitle = useCallback((newValue: string) =>
            // send only the property we need to change in the model
            dispatch(updateTaskTC({todolistId: props.todolistId, taskId: props.task.id, model: {title: newValue}})),
        [dispatch, props.task.id, props.todolistId]);

    return (
        <li key={props.task.id}
            className={props.filter !== "completed" && props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
            {/* transparent class is added when task is checked and not in completed filter */}
            <Checkbox checked={props.task.status === TaskStatuses.Completed} onChange={ChangeTaskStatus}
                      color="primary" disabled={props.disabled}/>
            <EditableSpan title={props.task.title} onChange={ChangeTaskTitle} disabled={props.disabled}/>
            <IconButton onClick={RemoveTask} disabled={props.disabled}>
                <Delete/>
            </IconButton>
        </li>
    )
});