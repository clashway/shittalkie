import React, { Component } from 'react';
import Aux from '../../hoc/Aux'
import Player from '../../components/Player/Player';
import ComparePlayers from '../../components/ComparePlayers/ComparePlayers'
import classes from './Players.css'
import Axios from 'axios';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircle from '@material-ui/icons/CheckCircle';
import { connect } from 'react-redux';
import { changeGame } from '../../actions/index';

const mapDispatchToProps = dispatch => {
  return {
    changeGame: game => dispatch(changeGame(game))
  };
};

const mapStateToProps = state => {
  return {
    game: state.game
  }
}

const defaultState = {
  // Handles to retrieve.
  getPlayers: [
    { handle: 'lash24', platform: 'pc' },
    { handle: 'daemon chaos', platform: 'xbl' },
    { handle: 'xvhand of godvx', platform: 'xbl' },
    { handle: 'captainobvs13', platform: 'xbl' },
    { handle: 'chapper_15', platform: 'xbl' },
    { handle: 'daddyfatsacksjr', platform: 'xbl' },
    { handle: 'ninja', platform: 'pc' },
    // { handle: 'not tfue', platform: 'pc'},

  ],
  // This will be the renderable players array.
  players: [],
  playersLoading: false,
  fortNitePlayers: [],
  statsType: 'lastNight',
  search: '',
  comparePlayers: [],
  playlistFilter: '',
  submitLoading: false,
  submitSuccess: false,
  submitError: '',
  rebuildStats: false,
}

class Players extends Component {
  state = defaultState;

  statsToggleHandler = () => {
    this.setState((prevState) => {
      return {
        statsType: prevState.statsType === 'currentSeason' ? 'lastNight' : 'currentSeason'
      };
    });
  }

  comparePlayersHandler = (handle, platform) => {
    const items = [...this.state.comparePlayers];
    const exists = items.filter(function (item) {
      if (item.handle === handle && item.platform === platform) {
        return true;
      }
      return false;
    });
    if (!exists.length) {
      if (items.length <= 1) {
        items.push({handle: handle, platform: platform});
      }
    } else {
      items.splice(exists, 1);
    }
    this.setState({ comparePlayers: items });
  }

  clearCompareHandler = () => {
    this.setState({
      comparePlayers: [],
      playlistFilter: ''
    });
  }

  playlistFilterHandler = (event) => {
    this.setState({ playlistFilter: event.target.value });
  }

  addPlayerHandler = () => {
    if (!this.state.search) {
      return;
    }
    const currentGame = this.props.game;
    const platform = this.state.search.includes('(pc)') ? 'pc' : 'xbl';
    this.setState({ submitLoading: true });
    this.timer = setTimeout(() => {
      let self = this;
      const search = this.state.search.toLowerCase().replace('(pc)', '').trim();
      const newPlayerPromise = this.lookupPlayer(search, currentGame, platform);
      newPlayerPromise.then(function (newPlayer) {
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
            newState.getPlayers = [{ handle: newPlayer.handle, platform: 'xbl' }, ...prevState.getPlayers];
            newState.search = '';
            localStorage.setItem('getPlayers', JSON.stringify(newState.getPlayers));
          }
          return newState;
        });
      });
    }, 2000)
  }

  removePlayerHandler = (name, platform) => {
    this.setState(prevState => {
      let players = [...prevState.players];
      let getPlayers = [...prevState.getPlayers];
      const playersRemoved = players.filter(function (player) {
        if (player.handle === name && player.platform === platform) {
          return false;
        }
        return true;
      });

      const getPlayersRemoved = getPlayers.filter(function (player) {
        if (player.handle === name && player.platform === platform) {
          return false;
        }
        return true;
      });
      localStorage.setItem('getPlayers', JSON.stringify(getPlayersRemoved));
      return {
        players: playersRemoved,
        getPlayers: getPlayersRemoved
      };
    });
  }

  resetPlayersHandler = () => {
    localStorage.setItem('getPlayers', JSON.stringify([]));
    window.location.reload();
  }

  searchFieldHandler = (event) => {
    this.setState({
      search: event.target.value,
      submitSuccess: false,
      submitError: ''
    });
  }

  searchKeyPressHandler = (event) => {
    if (event.key === 'Enter') {
      this.addPlayerHandler();
    }
  }

  lookupPlayer = (handle, game, platform = 'xbl') => {
    let name = '';
    switch (handle) {
      case 'cappy':
      case 'captainobvs13':
        name = 'Cappy';
        handle = 'captainobvs13';
        break;
      case 'wes':
      case 'daemon chaos':
        name = 'Wes';
        handle = 'daemon chaos';
        break;
      case 'lash':
      case 'lash24':
        name = 'Lash';
        handle = 'lash24';
        break;
      case 'plage':
      case 'xvhand of godvx':
        name = 'Plage';
        handle = 'xvhand of godvx';
        break;
      case 'chap':
      case 'chapper15':
      case 'chapper_15':
        name = 'Chap';
        handle = 'chapper_15';
        break;
      case 'daddyfatsacksjr':
      case 'daddy':
      case 'dfs':
        name = 'DFS';
        handle = 'daddyfatsacksjr';
        break;
      case 'ninja':
        name = 'Ninja';
        handle = 'ninja';
        break;
      default:
        name = handle;
    }
    const playerObj = {
      name: name,
      handle: handle
    };
    let playerReturn = {};
    switch (game) {
      case 'fortnite':
        const newPlayerPromise = this.lookupFortnitePlayer(handle, platform);
        playerReturn = newPlayerPromise.then(function (newPlayer) {
          return { ...newPlayer, ...playerObj };
        });
        break;
      default:
    }
    return playerReturn;
  }

  lookupFortnitePlayer = (handle, platform) => {
    const reqPath = "https://shitalkie-591a0.firebaseapp.com/api/getPlayer";
    return Axios.get(reqPath, {
      params: {
        player: handle,
        platform: platform
      }
    }).then((response) => {
      const playerData = response.data;
      let playerObj = {};

      // If error, return early.
      if (playerData.error) {
        return {
          handle: handle,
          platform: platform,
          error: playerData.error
        };
      }
      playerObj = {
        handle: handle,
        platform: platform,
        currentSeason: {
          updated: playerData.created
        },
        lastNight: {}
      }

      // Set current season.
      Object.keys(playerData.stats).forEach(function (playlist) {
        let label = '';
        let choke = null;
        switch (playlist) {
          case 'curr_p2':
            label = 'solo';
            choke = playerData.stats[playlist].top10.value;
            break;
          case 'curr_p10':
            label = 'duo';
            choke = playerData.stats[playlist].top5.value;
            break;
          case 'curr_p9':
            label = 'squad';
            choke = playerData.stats[playlist].top3.value;
            break;
          default:
            return;
        }
        playerObj.currentSeason[label] = {
          games: playerData.stats[playlist].matches.value,
          kills: playerData.stats[playlist].kills.value,
          kd: playerData.stats[playlist].kd.value,
          kpg: playerData.stats[playlist].kpg.value,
          wins: playerData.stats[playlist].top1.value,
          chokes: choke - playerData.stats[playlist].top1.value,
        }
      });

      // Set Last nite stats.
      if (playerData.oldStats) {
        playerObj.lastNight.updated = playerData.oldStats.created;
        Object.keys(playerData.stats).forEach(function (playlist) {
          let label = null;
          let choke = null;
          switch (playlist) {
            case 'curr_p2':
              label = 'solo';
              choke = 'top10';
              break;
            case 'curr_p10':
              label = 'duo';
              choke = 'top5';
              break;
            case 'curr_p9':
              label = 'squad';
              choke = 'top3';
              break;
            default:
              return;
          }
          if (playerData.oldStats[playlist] && playerData.stats[playlist]) {
            playerObj.lastNight[label] = {
              games: playerData.stats[playlist].matches.value - playerData.oldStats[playlist].matches.value,
              kills: playerData.stats[playlist].kills.value - playerData.oldStats[playlist].kills.value,
              kpg: Math.round(((playerData.stats[playlist].kills.value - playerData.oldStats[playlist].kills.value) / (playerData.stats[playlist].matches.value - playerData.oldStats[playlist].matches.value)) * 100) / 100,
              wins: playerData.stats[playlist].top1.value - playerData.oldStats[playlist].top1.value,
              chokes: (playerData.stats[playlist][choke].value - playerData.oldStats[playlist][choke].value) - (playerData.stats[playlist].top1.value - playerData.oldStats[playlist].top1.value),
            }
            if (isNaN(playerObj.lastNight[label].kpg)) {
              playerObj.lastNight[label].kpg = 0;
            }
          }
        });
      }
      return playerObj;
    });
  }

  componentDidMount() {
    let playersMounted = [];
    const currentGame = this.props.game;
    const storagePlayers = JSON.parse(localStorage.getItem('getPlayers')) || [];
    if (storagePlayers.length) {
      playersMounted = storagePlayers;
      this.setState({ getPlayers: storagePlayers });
    }
    else {
      playersMounted = this.state.getPlayers;
    }
    if (playersMounted.length <= 0) {
      return;
    }
    this.setState({ playersLoading: true });
    switch (currentGame) {
      case 'fortnite':
        return playersMounted.map(playerMounted => {
          const newPlayerPromise = this.lookupPlayer(playerMounted.handle, currentGame, playerMounted.platform);
          let self = this;
          return newPlayerPromise.then(function (newPlayer) {
            if (!newPlayer.currentSeason) {
              return false;
            }
            setTimeout(function () {
              self.setState(prevState => {
                return {
                  playersLoading: false,
                  players: [...prevState.players, newPlayer],
                  fortNitePlayers: [...prevState.players, newPlayer]
                }
              });
            }, 1500);
          });
        });
      default:
    }
  }

  render() {
    const currentGame = this.props.game;
    const comparePlayers = this.state.comparePlayers;
    const currentPlayers = this.state.players;
    let comparePlayersRender = '';
    let isComparing = this.state.comparePlayers.length === 2;
    let activeCompare = [];
    if (isComparing) {
      currentPlayers.forEach(function (player) {
        var exists = comparePlayers.some(function (comparePlayer) {
          if (comparePlayer.handle === player.handle && comparePlayer.platform === player.platform) {
            return true;
          }
          return false;
        });
        if (exists) {
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

    let buttonClasses = [classes.SearchButton];
    if (this.state.submitLoading) {
      buttonClasses.push(classes.Loading);
    }

    let players = (
      this.state.players.map((p, index) => {
        return <Grid item xs={12} key={p.name + index}>
          <Player
            player={p}
            game={currentGame}
            displayType={this.state.statsType}
            clicked={this.comparePlayersHandler}
            removed={this.removePlayerHandler}
            comparePlayers={this.state.comparePlayers}
          />
        </Grid>
      })
    );
    return (
      <Aux>
        <header>
          <div className={classes.PrimaryNav}>
            <h1>Shitalkie</h1>
            <h2 className={classes.MainTitle}>{currentGame} Stats</h2>
            <Button onClick={this.statsToggleHandler} variant="outlined" color="secondary" classes={{ root: classes.StatsToggle }}>
              {this.state.statsType === 'currentSeason' ? 'Current Season' : 'Last Nite'}
            </Button>
          </div>
          {!isComparing ? <form className={classes.SearchArea} noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <Button onClick={this.resetPlayersHandler} size="small" variant="outlined" color="secondary" classes={{ root: classes.ResetPlayers }}>
              reset players
            </Button>
            <TextField
              error={this.state.submitError ? true : false}
              helperText={this.state.submitError ? this.state.submitError : 'for pc add (pc) -- "ninja (pc)"' }
              className={classes.SearchField}
              label="Add Player:"
              placeholder="handle"
              value={this.state.search}
              onChange={this.searchFieldHandler}
              onKeyPress={this.searchKeyPressHandler}
            />
            <Button
              classes={{ root: buttonClasses.join(' ') }}
              variant="contained"
              color="primary"
              disabled={this.state.submitLoading}
              onClick={this.addPlayerHandler}>
              Add
            </Button>
            {this.state.submitSuccess ? <CheckCircle color="action" className={classes.CheckCircle} /> : null}
            {this.state.submitLoading && <CircularProgress size={24} className={classes.CircularProgress} />}
          </form> : null}

          {comparePlayersRender}
        </header>
        <main>
          {!isComparing ?
            <div className={classes.Players}>
              <Grid container
                justify="center"
                direction="column"
                alignItems="center"
                spacing={24}>
                {this.state.playersLoading ? <CircularProgress size={64} className={classes.PlayersCircularProgress} /> : players}
              </Grid>
            </div> : null}
        </main>
      </Aux>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Players);
