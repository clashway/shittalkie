import React, { Component } from 'react';
import classes from './App.css';
import Players from './Players/Players'
import CssBaseline from '@material-ui/core/CssBaseline';
import { Provider } from 'react-redux';
import store from '../store/index'

class App extends Component {
  render() {
    return (
      <div className={classes.App}>
        <CssBaseline />
        <h1>Shitalkie</h1>
        <Provider store={store}>
          <Players />
        </Provider>
      </div>
    );
  }
}

export default App;
