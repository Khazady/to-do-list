import React from 'react';
import AppWithRedux from "../AppWithRedux";
import {ReduxStoreProviderDecorator} from "./decorators/ReduxStoreProviderDecorator";

//настройки
export default {
    title: 'AppWithRedux Stories',
    component: AppWithRedux,
    decorators: [ReduxStoreProviderDecorator]
};

//AddItemForm в пропсах ждёт колбек, поэтому передаем туда action (фейковый коллбек)
export const BaseExample = () => {
    return (
        <AppWithRedux/>
    )
}