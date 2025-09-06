import React from 'react';
import {ReduxStoreProviderDecorator} from "../stories/decorators/ReduxStoreProviderDecorator";
import App from "./App";

// settings
export default {
    title: 'App Stories',
    component: App,
    decorators: [ReduxStoreProviderDecorator]
};

//no server interactions in demo
export const BaseExample = () => {
    return (
        <App demo/>
    )
}