import React, { Component } from 'react';
import Aux from '../../hoc/Aux'
import Player from '../../components/Player/Player';
import ComparePlayers from '../../components/ComparePlayers/ComparePlayers'
import classes from './Players.css'
import Axios from 'axios';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircle from '@material-ui/icons/CheckCircle';

class Players extends Component {
  state = {
    // Handles to retrieve.
    getPlayers: [
      'lash24',
      'daemon chaos',
      'xvhand of godvx',
      'captainobvs13',
      'chapper_15',
      // 'gronky12',
    ],
    // This will be the renderable players array.
    players: [],
    statsType: 'lastNight',
    search: '',
    comparePlayers: [],
    playlistFilter: '',
    submitLoading: false,
    submitSuccess: false,
    submitError: '',
  }

  statsToggleHandler = () => {
    this.setState((prevState) => {
      return {
        statsType: prevState.statsType === 'currentSeason' ? 'lastNight' : 'currentSeason'
      };
    });
  }

  comparePlayersHandler = (handle) => {
    const items = [...this.state.comparePlayers];
    const exists = items.indexOf(handle);
    if (exists === -1) {
      if (items.length <= 1) {
        items.push(handle);
      }
    } else {
      items.splice(exists, 1);
    }
    this.setState({comparePlayers: items});
  }

  clearCompareHandler = () => {
    this.setState({comparePlayers: []});
  }

  playlistFilterHandler = (event) => {
    this.setState({playlistFilter: event.target.value});
  }

  addPlayerHandler = () => {
    this.setState({submitLoading: true});
    this.timer = setTimeout(() => {
      let self = this;
      const search = this.state.search.toLowerCase();
      const newPlayerPromise = this.lookupFortnitePlayer(search);
      newPlayerPromise.then(function(newPlayer) {
        self.setState(prevState => {
          let newState = {
            submitLoading: false,
            submitSuccess: true,
            submitError: ''
          }
          if (newPlayer.error) {
            newState.submitSuccess = false;
            newState.submitError = newPlayer.error;
          } else {
            newState.players = [newPlayer, ...prevState.players];
            newState.search = '';
          }
          return newState;
        });
      });
    }, 2000)

  }

  searchFieldHandler = (event) => {
    this.setState({
      search: event.target.value
    });
  }

  searchKeyPressHandler = (event) => {
    if (event.key === 'Enter') {
      this.addPlayerHandler();
    }
  }

  lookupFortnitePlayer = (handle) => {
    let name = '';
    switch (handle) {
      case 'captainobvs13':
        name = 'Cappy';
        break;
      case 'daemon chaos':
        name = 'Wes';
        break;
      case 'lash24':
        name = 'Lash';
        break;
      case 'xvhand of godvx':
        name = 'Plage';
        break;
      case 'chapper_15':
        name = 'Chap';
        break;
      case 'gronky12':
        name = 'GronkyHD';
        break;
      default:
        name = handle;
    }
    const reqPath = "https://shitalkie-591a0.firebaseapp.com/api/getPlayer?player=";
    // const reqPath = '/api/getPlayer?player=';
    return Axios.get(reqPath + handle).then((response) => {
      const playerData = response.data;
      let playerObj = {};
      if (playerData.error) {
        playerObj = {
          handle: handle,
          name: name,
          error: playerData.error
        };
      } else {
        playerObj = {
          handle: handle,
          name: name,
          currentSeason: {
            updated: playerData.created
          },
          lastNight: {}
        }

        // Set current season.
        Object.keys(playerData.stats).forEach(function(key,index) {
          let label = '';
          switch (key) {
            case 'curr_p2':
              label = 'solo';
              break;
            case 'curr_p9':
              label = 'squad';
              break;
            case 'curr_p10':
              label = 'duo';
              break;
            default:
              return;
          }
          playerObj.currentSeason[label] = {
            games: playerData.stats[key].matches.value,
            kills: playerData.stats[key].kills.value,
            kd: playerData.stats[key].kd.value,
            kpg: playerData.stats[key].kpg.value,
            wins: playerData.stats[key].top1.value,
          }
        });
        if (playerData.oldStats) {
          playerObj.lastNight.updated = playerData.oldStats.created;
          Object.keys(playerData.stats).forEach(function(key,index) {
            let label = null;
            switch (key) {
              case 'curr_p2':
                label = 'solo';
                break;
              case 'curr_p9':
                label = 'squad';
                break;
              case 'curr_p10':
                label = 'duo';
                break;
              default:
                return;
            }
            playerObj.lastNight[label] = {
              games: playerData.stats[key].matches.value - playerData.oldStats[key].matches.value,
              kills: playerData.stats[key].kills.value - playerData.oldStats[key].kills.value,
              kpg: Math.round(((playerData.stats[key].kills.value - playerData.oldStats[key].kills.value) / (playerData.stats[key].matches.value - playerData.oldStats[key].matches.value)) * 100) / 100,
              wins: playerData.stats[key].top1.value - playerData.oldStats[key].top1.value,
            }
            if (isNaN(playerObj.lastNight[label].kpg)) {
              playerObj.lastNight[label].kpg = 0;
            }
          });
        }
      }
      return playerObj;
    });
  }

  componentDidMount() {
    this.state.getPlayers.map((handle, index) => {
      const newPlayerPromise = this.lookupFortnitePlayer(handle);
      let self = this;
      return newPlayerPromise.then(function(newPlayer) {
        self.setState(prevState => {
          return {players: [...prevState.players, newPlayer]}
        });
      });
    });
  }

  render() {
    let comparePlayersRender = '';
    let isComparing = this.state.comparePlayers.length === 2;
    if (isComparing) {
      const comparePlayers = this.state.comparePlayers;
      const currentPlayers = this.state.players;
      let activeCompare = [];
      currentPlayers.forEach(function (player) {
        if (comparePlayers.indexOf(player.handle) !== -1) {
          activeCompare.push(player);
        }
      });
      comparePlayersRender = <ComparePlayers
        players={activeCompare}
        statsType={this.state.statsType}
        playlistFilter={this.state.playlistFilter}
        changed={this.playlistFilterHandler}
        cleared={this.clearCompareHandler}
        gutterBottom />;
    }
    else if (this.state.comparePlayers.length === 0){
      comparePlayersRender = <Typography variant="caption" className={classes.CompareHelper} gutterBottom>click a player to start comparing</Typography>
    }

    let buttonClasses = [classes.SearchButton];
    if (this.state.submitLoading) {
      buttonClasses.push(classes.Loading);
    }

    let players = (
      this.state.players.map((p, index) => {
        return <Grid item xs={12} key={p.name + index} zeroMinWidth>
                  <Player player={p}
                    displayType={this.state.statsType}
                    clicked={this.comparePlayersHandler}
                    comparePlayers={this.state.comparePlayers}
                    />
              </Grid>
      })
    );
    return (
      <Aux>
        <h2 className={classes.MainTitle}>Fortnite Stats</h2>
        <Button onClick={this.statsToggleHandler} variant="outlined" color="secondary" classes={{root: classes.StatsToggle }}>
          {this.state.statsType === 'currentSeason' ? 'S5 Totals' : 'Last 24 Hours'}
        </Button>
        { !isComparing ? <form className={classes.SearchArea} noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <TextField
            error={this.state.submitError ? true : false}
            helperText={this.state.submitError}
            className={classes.SearchField}
            label="Search Player:"
            placeholder="xbox handle"
            value={this.state.search}
            onChange={this.searchFieldHandler}
            onKeyPress={this.searchKeyPressHandler}
            />

          {this.state.submitLoading ? <CircularProgress /> :
          <Button
            classes={{root: buttonClasses.join(' ')}}
            variant="contained"
            color="primary"
            onClick={this.addPlayerHandler}>Search
          </Button>
          }
          {this.state.submitSuccess ? <CheckCircle color="action" /> : null }
        </form> : null}

        { comparePlayersRender }
        {!isComparing ?

          <div className={classes.Players}>
          <Grid container
            justify="center"
            direction="column"
            alignItems="center"
            spacing={24}
            >
            {players}
          </Grid>

        </div>  : null}
      </Aux>
    );
  }
}

export default Players;
