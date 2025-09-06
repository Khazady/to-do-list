import React from 'react';
import { action } from '@storybook/addon-actions';
import EditableSpan from "./EditableSpan";

export default {
    title: 'EditableSpan Stories',
    component: EditableSpan,
};

// action is the StoryBook console
const changeCallback = action("Value changed");

// AddItemForm expects a callback in props, so we pass action (a fake callback)
export const BaseExample = () => {
    return (
        <EditableSpan title={"Start value"} onChange={changeCallback}/>
    )
}

export const DisabledExample = () => {
    return (
        <EditableSpan title={"Start value"} onChange={changeCallback} disabled/>
    )
}