import React from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, Menu, Toolbar, Typography} from "@material-ui/core";
import {TodolistsList} from "../features (pages)/TodolistsList/TodolistsList";
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import {ErrorSnackbar} from "../components (common)/ErrorSnackbar/ErrorSnackbar";
import {useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import { RequestStatusType } from './app-reducer';

function App() {
    let status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    return (
      <div className="App">
          <AppBar position="static">
              <Toolbar>
                  <IconButton edge="start" color="inherit" aria-label="menu">
                      <Menu open={false}/>
                  </IconButton>
                  <Typography variant="h6">
                      News
                  </Typography>
                  <Button color="inherit">Login</Button>
              </Toolbar>
          </AppBar>
          { status === "loading" && <LinearProgress color="secondary" /> }
          <Container fixed>
              <TodolistsList/>
          </Container>
          <ErrorSnackbar/>
      </div>
    )
}

export default App;
