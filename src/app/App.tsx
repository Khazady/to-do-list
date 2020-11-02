import React from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, Menu, Toolbar, Typography} from "@material-ui/core";
import {TodolistsList} from "../features (pages)/TodolistsList/TodolistsList";

function App() {
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
              <TodolistsList/>
          </Container>
      </div>
    )
}

export default App;
