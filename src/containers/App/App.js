import React, { Component } from 'react';
import classes from './App.css';
import Players from '../Players/Players'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import store from '../../store/index'

const theme = createMuiTheme({
  // Primary colors
  palette: {
    primary: { main: '#b8b6b4' },
    secondary: { main: '#66c0f4' },
    // contrastText: { main: '#fff' }
  },
  overrides: {
    // Player Card
    MuiPaper: {
      'root': {
        'background-color': '#66c0f4',
      },
    },
    // Search button
    MuiButton: {
      'containedPrimary': {
        'background-color': 'transparent',
        'color': '#fff',
      }
    },
    // Player Card Cell
    MuiTableCell: {
      'root': {
        'border-bottom': '1px solid rgba(0, 0, 0, 0.42)',
      }
    },
    MuiTypography: {
      'title': {
        'color': '#b8b6b4',
      },
      'caption': {
        'color': '#b8b6b4',
      }
    },
    MuiInput: {
      'root': {
        color: '#b8b6b4',
      }
    },
    MuiFormLabel: {
      'root': {
        'color': ''
      }
    },
    MuiFormHelperText: {
      'root': {
        'color': ''
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
