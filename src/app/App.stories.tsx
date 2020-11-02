import React from 'react';
import {ReduxStoreProviderDecorator} from "../stories/decorators/ReduxStoreProviderDecorator";
import App from "./App";

//настройки
export default {
    title: 'App Stories',
    component: App,
    decorators: [ReduxStoreProviderDecorator]
};

//AddItemForm в пропсах ждёт колбек, поэтому передаем туда action (фейковый коллбек)
export const BaseExample = () => {
    return (
        <App/>
    )
}