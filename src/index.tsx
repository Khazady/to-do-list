import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {Provider} from 'react-redux'
import {store} from './app/store'
import App from './app/App'
import {HashRouter} from 'react-router-dom'

ReactDOM.render(
  // Provider shares the store with all of its children

  <Provider store={store}>
      <HashRouter>
          <App/>
      </HashRouter>
  </Provider>,

  document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
