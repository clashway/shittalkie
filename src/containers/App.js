import React, { Component } from 'react';
import classes from './App.css';
import Players from './Players/Players'
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends Component {
  render() {
    return (
      <div className={classes.App}>
        <CssBaseline />
        <h1>Wall of Shame</h1>
        <Players />
      </div>
    );
  }
}

export default App;
