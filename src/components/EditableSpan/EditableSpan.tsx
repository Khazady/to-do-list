import React, {ChangeEvent, KeyboardEvent, useState} from "react";

type EditableSpanPropsType = {
    title: string;
    onChange: (newTitle: string) => void
}

function EditableSpan(props: EditableSpanPropsType) {
    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState<string>("");

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.title);
    }

    const  activateViewMode = () => {
        setEditMode(false);
        props.onChange(title)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value);
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) =>  e.charCode === 13 && activateViewMode();

    return editMode
      ? <input value={title}
               autoFocus
               onBlur={() => activateViewMode() }
               onChange={onChangeHandler}
               onKeyPress={onKeyPressHandler}
      />
      : <span onDoubleClick={() => activateEditMode() }>{props.title}</span>
}

export default EditableSpan;