import React, { Component } from 'react';
import classes from './App.css';
import Players from '../Players/Players'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import store from '../../store/index'

const theme = createMuiTheme({
  // Primary colors
  palette: {
    primary: { main: '#455A64' },
    secondary: { main: '#FDD835' },
    contrastText: { main: '#FDD835' }
  },
  overrides: {
    // Player Card
    MuiPaper: {
      'root': {
        'background-color': '#B3E5FC',
      },
    },
    // Search button
    MuiButton: {
      'containedPrimary': {
        'color': '#fff',
      }
    },
    // Player Card Cell
    MuiTableCell: {
      'root': {
        'border-bottom': '1px solid rgba(0, 0, 0, 0.42)',
      }
    }
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
