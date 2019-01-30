import React, { Component } from 'react';
import classes from './App.css';
import Players from '../Players/Players'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import store from '../../store/index'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

class App extends Component {
  render() {
    return (
      <div className={classes.App}>
        <MuiThemeProvider theme={theme}>
          <Provider store={store}>
            <Players />
          </Provider>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
