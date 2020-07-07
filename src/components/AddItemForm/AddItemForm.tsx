import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {Button} from "@material-ui/core";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

function AddItemForm(props: AddItemFormPropsType) {

    /*локальный стейт инпута, синхронизируем value инпута с отрисовкой по клику новой таски в title*/
    let [title, setTitle] = useState<string>("");
    let [error, setError] = useState<string | null>(null)

    /*пихает из локального стейта в функцию addTask в App* и удаляет пробелы */
    const addItem = () => {
        if(title.trim() !== "") {
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
        e.charCode === 13 && addItem()
    }

    return (
      <div>
          <input value={title}
                 onChange={onChangeHandler}
                 onKeyPress={onKeyPressHandler}
                 className={error ? "error" : ""}/> {/*если ошибка то класс error, нет - пустой класснейм*/}
          <Button variant={"contained"} color={"primary"} onClick={addItem}>+</Button>

          {error && <div className="error-message">{error}</div>} {/* если есть ошибка, то отрисовываем*/}
      </div>
    )
}


export default AddItemForm;