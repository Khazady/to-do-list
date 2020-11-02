import React from 'react';
import './App.css';
import {AppBar, Button, Container, Grid, IconButton, Menu, Paper, Toolbar, Typography} from "@material-ui/core";
import {TodolistBusinessType,} from "../state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {Todolists} from '../features (pages)/Todolists/Todolists';

function AppWithRedux() {

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
          <Container fixed>

                                <Todolists
                                />

          </Container>
      </div>
    )
}

export default AppWithRedux;
