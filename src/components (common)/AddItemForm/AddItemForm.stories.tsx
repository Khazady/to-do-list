import React from 'react';
import { action } from '@storybook/addon-actions';
import AddItemForm from "./AddItemForm";

export default {
    title: 'AddItemForm Stories',
    component: AddItemForm,
};

export const BaseExample = () => {
    return (
        <AddItemForm addItem={(title: string) => alert(title)}/>
    )
}

// action is the StoryBook console
const callback = action("Button inside form was clicked");

// AddItemForm expects a callback in props, so we pass action (a fake callback)
export const WithActionExample = () => {
    return (
        <AddItemForm addItem={callback}/>
    )
}
export const DisabledExample = () => {
    return (
        <AddItemForm addItem={callback} disabled/>
    )
}