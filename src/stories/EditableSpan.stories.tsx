import React from 'react';
import { action } from '@storybook/addon-actions';
import EditableSpan from '../components/EditableSpan/EditableSpan';

export default {
    title: 'EditableSpan Stories',
    component: EditableSpan,
};

//action это консоль в StoryBook
const changeCallback = action("Value changed");

//AddItemForm в пропсах ждёт колбек, поэтому передаем туда action (фейковый коллбек)
export const BaseExample = () => {
    return (
        <EditableSpan title={"Start value"} onChange={changeCallback}/>
    )
}