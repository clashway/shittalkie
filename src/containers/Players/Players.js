import React, { Component } from 'react';
import Aux from '../../hoc/Aux'
import Player from '../../components/Player/Player';
import ComparePlayers from '../../components/ComparePlayers/ComparePlayers'
import classes from './Players.css'
import Axios from 'axios';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

class Players extends Component {
  state = {
    // Handles to retrieve.
    getPlayers: [
      'lash24',
      'daemon chaos',
      'xvhand of godvx',
      // 'captainobvs13',
      // 'chapper15',
      // 'gronky12',
    ],
    // This will be the renderable players array.
    players: [],
    statsType: 'total',
    search: '',
    comparePlayers: [],
  }

  statsToggleHandler = () => {
    this.setState((prevState) => {
      return {
        statsType: prevState.statsType === 'total' ? 'lastNight' : 'total'
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

    if (items.length === 2) {

    }
  }

  comparePlaylistsHandler = (handle, playlist) => {
    console.log(handle, playlist);
    return false;
  }

  addPlayerHandler = () => {
    let self = this;
    const search = this.state.search.toLowerCase();
    const newPlayerPromise = this.lookupPlayer(search);
    newPlayerPromise.then(function(newPlayer) {
      self.setState(prevState => {
        return {players: [newPlayer, ...prevState.players]}
      });
    });
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

  lookupPlayer = (handle) => {
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
      case 'chapper15':
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
          currentSeason : {
            updated: playerData.created,
            solo: {
              games: playerData.stats.curr_p2.matches.value,
              kills: playerData.stats.curr_p2.kills.value,
              kd: playerData.stats.curr_p2.kd.value,
              kpg: playerData.stats.curr_p2.kpg.value,
              wins: playerData.stats.curr_p2.top1.value,
            },
            duo: {
              games: playerData.stats.curr_p10.matches.value,
              kills: playerData.stats.curr_p10.kills.value,
              kd: playerData.stats.curr_p10.kd.value,
              kpg: playerData.stats.curr_p10.kpg.value,
              wins: playerData.stats.curr_p10.top1.value,
            },
            squad: {
              games: playerData.stats.curr_p9.matches.value,
              kills: playerData.stats.curr_p9.kills.value,
              kd: playerData.stats.curr_p9.kd.value,
              kpg: playerData.stats.curr_p9.kpg.value,
              wins: playerData.stats.curr_p9.top1.value,
            }
          },
          lastNight: {
            updated: playerData.oldStats.created,
            solo: {
              games: playerData.stats.curr_p2.matches.value - playerData.oldStats.curr_p2.matches.value,
              kills: playerData.stats.curr_p2.kills.value - playerData.oldStats.curr_p2.kills.value,
              kpg: Math.round(((playerData.stats.curr_p2.kills.value - playerData.oldStats.curr_p2.kills.value) / (playerData.stats.curr_p2.matches.value - playerData.oldStats.curr_p2.matches.value)) * 100) / 100,
              wins: playerData.stats.curr_p2.top1.value - playerData.oldStats.curr_p2.top1.value,
            },
            duo: {
              games: playerData.stats.curr_p10.matches.value - playerData.oldStats.curr_p10.matches.value,
              kills: playerData.stats.curr_p10.kills.value - playerData.oldStats.curr_p10.kills.value,
              kpg: Math.round(((playerData.stats.curr_p10.kills.value - playerData.oldStats.curr_p10.kills.value) / (playerData.stats.curr_p10.matches.value - playerData.oldStats.curr_p10.matches.value)) * 100) / 100,
              wins: playerData.stats.curr_p10.top1.value - playerData.oldStats.curr_p10.top1.value,
            },
            squad: {
              games: playerData.stats.curr_p9.matches.value - playerData.oldStats.curr_p9.matches.value,
              kills: playerData.stats.curr_p9.kills.value - playerData.oldStats.curr_p9.kills.value,
              kpg: Math.round(((playerData.stats.curr_p9.kills.value - playerData.oldStats.curr_p9.kills.value) / (playerData.stats.curr_p9.matches.value - playerData.oldStats.curr_p9.matches.value)) * 100) / 100,
              wins: playerData.stats.curr_p9.top1.value - playerData.oldStats.curr_p9.top1.value,
            }
          }
        }
      }
      return playerObj;
    });
  }

  componentDidMount() {
    this.state.getPlayers.map((handle, index) => {
      const newPlayerPromise = this.lookupPlayer(handle);
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
    if (this.state.comparePlayers.length === 2) {
      const comparePlayers = this.state.comparePlayers;
      const currentPlayers = this.state.players;
      let activeCompare = [];
      currentPlayers.forEach(function (player) {
        if (comparePlayers.indexOf(player.handle) !== -1) {
          activeCompare.push(player);
        }
      });
      comparePlayersRender = <ComparePlayers players={activeCompare} statsType={this.state.statsType} />;
    }

    return (
      <Aux>
        <h2 className={classes.MainTitle} onClick={this.statsToggleHandler}>Fortnite Stats ({this.state.statsType === 'total' ? 'S5 Totals' : 'Last Night'})</h2>
        <div>
          <TextField
            label="Search Player:"
            placeholder="xbox handle"
            value={this.state.search}
            onChange={this.searchFieldHandler}
            onKeyPress={this.searchKeyPressHandler}
            margin="normal"
            />
          <Button variant="contained" color="primary" onClick={this.addPlayerHandler}>Search</Button>
        </div>
        { comparePlayersRender }
        <div className={classes.Players}>
          <Grid container
            justify="center"
            direction="column"
            alignItems="center"
            spacing={24}
            >
            {this.state.players.map((p, index) => {
              return <Grid item key={p.name + index}><Player player={p}
                displayType={this.state.statsType}
                clicked={this.comparePlayersHandler}
                comparePlayers={this.state.comparePlayers}
                /></Grid>
            })}
          </Grid>

        </div>
      </Aux>
    );
  }
}

export default Players;
