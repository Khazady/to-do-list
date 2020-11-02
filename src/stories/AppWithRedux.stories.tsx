import React from 'react';
import {ReduxStoreProviderDecorator} from "./decorators/ReduxStoreProviderDecorator";
import AppWithRedux from "../app/AppWithRedux";

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