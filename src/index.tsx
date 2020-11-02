import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from "react-redux";
import {store} from "./state/store";
import AppWithRedux from './app/AppWithRedux';

ReactDOM.render(
  //провайдер расшаривает стор для всех своих детей
  <Provider store={store}>
      <AppWithRedux/>
  </Provider>,

  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
