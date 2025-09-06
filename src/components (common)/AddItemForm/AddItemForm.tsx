import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

type AddItemFormPropsType = {
    addItem: (title: string) => void
    // sometimes we need to disable Add button, e.g., when a TL is being deleted
    disabled?: boolean
}

// React.memo prevents re-render when same props arrive
// but since we receive the same (for humans) callback every time and functions are objects that aren't equal
// re-render still happens, so use useCallback in addTask
export const AddItemForm = React.memo(function(props: AddItemFormPropsType) {
    console.log("AddItemForm rendered")

    /* local state of the input; synchronize input value with rendering when adding new task to title */
    let [title, setTitle] = useState<string>("");
    let [error, setError] = useState<string | null>(null)

    /* pushes from local state into addTask function in App and trims spaces */
    const addItem = () => {
        if (title.trim() !== "") {
            props.addItem(title);
            setTitle("")
        } else {
            setError("Title is not required")
        }
    };
    /* re-render input: put typed value into local state and clear error while typing */
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
        setError(null);
    };
    /* if Enter pressed, pass to App */
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        // so setError doesn't reset error on every key press
        if (error !== null) {
            setError(null)
        }
        e.charCode === 13 && addItem()
    }

    return (
      <div>
          <TextField value={title}
                     onChange={onChangeHandler}
                     onKeyPress={onKeyPressHandler}
                     variant="outlined"
            // pseudo truthiness; TS blocks automatic string-to-boolean conversion, so we do it manually with operator
                     error={!!error}
                     label={"Title"}
                     helperText={error}
                     disabled={props.disabled}
          />
          <IconButton color="primary" onClick={addItem} disabled={props.disabled}>
              <AddBox/>
          </IconButton>
      </div>
    )
} );


export default AddItemForm;
