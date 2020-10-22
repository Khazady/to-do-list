import React from 'react';
import {action} from '@storybook/addon-actions';
import {Task} from '../components/TodoList/Task/Task';
import {ReduxStoreProviderDecorator} from "./decorators/ReduxStoreProviderDecorator";

export default {
    title: 'Task Stories',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
};

//action это консоль в StoryBook
const callback = action("Button inside form was clicked");

//AddItemForm в пропсах ждёт колбек, поэтому передаем туда action (фейковый коллбек)
//я сделал компоненты неконтролируемыми, поэтому здесь нету коллбэков (возможно надо исправить)
export const BaseExample = () => {
    return (
        <>
            <Task task={{id: "1", isDone: true, title: "CSS"}}
                  filter={"active"}
                  todolistId={"todolistId1"}/>
            <Task task={{id: "2", isDone: false, title: "JS"}}
                  filter={"active"}
                  todolistId={"todolistId2"}/>
        </>
    )
}