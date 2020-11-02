import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

//React.memo предотвращает перерисовку когда приходят такие же пропсы
//но т.к. нам приходит каждый раз одинаковый(для человека) коллбэк, а func это obj, а одинаковые объекты не равны
//все равно происходит перерисовка, поэтому useCallback в addTask
export const AddItemForm = React.memo(function(props: AddItemFormPropsType) {
    console.log("AddItemForm rendered")

    /*локальный стейт инпута, синхронизируем value инпута с отрисовкой по клику новой таски в title*/
    let [title, setTitle] = useState<string>("");
    let [error, setError] = useState<string | null>(null)

    /*пихает из локального стейта в функцию addTask в App* и удаляет пробелы */
    const addItem = () => {
        if (title.trim() !== "") {
            props.addItem(title);
            setTitle("")
        } else {
            setError("Title is not required")
        }
    };
    /*перерисовка инпута, засовываем в локал стейт впечатанное значение инпута и убираем ошибку, впечатывая*/
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
        setError(null);
    };
    /*если нажат интер, то пихнуть в App*/
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        //чтобы setError не занулял ошибку при каждом нажатии клавиши
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
            //Псевдоистина, тс блочит автомат. преобр. строки в булево, поэтому оператором делаем вручную
                     error={!!error}
                     label={"Title"}
                     helperText={error}
          />
          <IconButton color="primary" onClick={addItem}>
              <AddBox/>
          </IconButton>
      </div>
    )
} );


export default AddItemForm;