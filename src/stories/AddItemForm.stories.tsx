import React from 'react';
import { action } from '@storybook/addon-actions';
import { AddItemForm } from '../components/AddItemForm/AddItemForm';

export default {
    title: 'AddItemForm Stories',
    component: AddItemForm,
};

export const BaseExample = () => {
    return (
        <AddItemForm addItem={(title: string) => alert(title)}/>
    )
}

//action это консоль в StoryBook
const callback = action("Button inside form was clicked");

//AddItemForm в пропсах ждёт колбек, поэтому передаем туда action (фейковый коллбек)
export const WithActionExample = () => {
    return (
        <AddItemForm addItem={callback}/>
    )
}