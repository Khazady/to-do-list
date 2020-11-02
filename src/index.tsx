import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from "react-redux";
import {store} from "./app/store";
import App from './app/App';

ReactDOM.render(
  //провайдер расшаривает стор для всех своих детей
  <Provider store={store}>
      <App/>
  </Provider>,

  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
