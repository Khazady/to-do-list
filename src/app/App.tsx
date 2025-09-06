import React, {useCallback, useEffect} from 'react'
import './App.css'
import {AppBar, Button, Container, IconButton, Menu, Toolbar, Typography} from '@material-ui/core'
import {TodolistsList} from '../features (pages)/TodolistsList/TodolistsList'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import {ErrorSnackbar} from '../components (common)/ErrorSnackbar/ErrorSnackbar'
import {useDispatch, useSelector} from 'react-redux'
import {RootStateType} from './store'
import {initializeAppTC, RequestStatusType} from './app-reducer'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Login} from '../features (pages)/Login/Login'
import {logoutTC} from '../features (pages)/Login/auth-reducer'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'

//for storybook
type PropsType = { demo?: boolean }

//demo default value false (if (typeof demo === 'undefined') )
const App: React.FC<PropsType> = ({demo = false}) => {
    let dispatch = useDispatch()
    let status = useSelector<RootStateType, RequestStatusType>(state => state.app.status)
    let isInitialized = useSelector<RootStateType, boolean>(state => state.app.isInitialized)
    let isLoggedIn = useSelector<RootStateType, boolean>(state => state.auth.isLoggedIn)


    // runs only once, sets isLoggedIn to true so it re-renders from spinner to the app
    useEffect(() => {
        if (!demo) {
            dispatch(initializeAppTC())
        }
    }, [])
    const logoutHandler = useCallback(() => dispatch(logoutTC()), [])
    // if not yet initialized (hasn't sent 'get me' to check user login), show spinner
    if (!isInitialized) {
        return <div
          style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
      <div className="App">
          <AppBar position="static">
              <Toolbar>
                  <IconButton edge="start" color="inherit" aria-label="menu">
                      <Menu open={false}/>
                  </IconButton>
                  <Typography variant="h6">
                      Hi there, this is my To-do-list
                  </Typography>
                  {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
              </Toolbar>
          </AppBar>
          {status === 'loading' && <div className="progress-bar"><LinearProgress color="secondary"/></div>}
          <Container fixed>
              <Switch>
                  <Route exact path={'/'} render={() => <TodolistsList demo={demo}/>}/>
                  <Route path={'/login'} render={() => <Login/>}/>
                  {/* redirect to /404 if we have not that path in routes */}
                  <Route path={'/404'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
                  <Redirect from={'*'} to={'/404'}/>
              </Switch>
          </Container>
          <ErrorSnackbar/>
      </div>
    )
}

export default App
