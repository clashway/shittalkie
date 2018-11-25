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

class Players extends Component {
  state = {
    // Handles to retrieve.
    getPlayers: [
      'lash24',
      'daemon chaos',
      'xvhand of godvx',
      'captainobvs13',
      'chapper_15'
    ],
    // This will be the renderable players array.
    players: [],
    playersLoading: false,
    fortNitePlayers: [],
    rocketLeaguePlayers: [],
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
  gameToggleHandler = () => {
    const currentGame = this.props.game;
    const newGame = currentGame === 'fortnite' ? 'rocketLeague' : 'fortnite';
    if (this.state.comparePlayers.length > 0) {
      return;
    }
    this.setState({ players: [] });

    // Change Redux Store.
    this.props.changeGame(newGame);

    let newPlayers = [];
    switch (newGame) {
      case 'fortnite':
        newPlayers = [...this.state.fortNitePlayers];
        if (this.state.fortNitePlayers.length === 0) {
          let self = this;
          return this.state.getPlayers.map((handle, index) => {
            const newPlayerPromise = self.lookupPlayer(handle, newGame);
            return newPlayerPromise.then(function (newPlayer) {
              self.setState(prevState => {
                return {
                  players: [...prevState.players, newPlayer],
                  fortNitePlayers: [...prevState.players, newPlayer]
                }
              });
            });
          });
        }
        break;
      case 'rocketLeague':
        newPlayers = [...this.state.rocketLeaguePlayers];
        if (this.state.rocketLeaguePlayers.length === 0) {
          let self = this;
          return this.state.getPlayers.map((handle, index) => {
            const newPlayer = self.lookupPlayer(handle, newGame);
            return self.setState(prevState => {
              return {
                players: [...prevState.players, newPlayer],
                rocketLeaguePlayers: [...prevState.players, newPlayer]
              }
            });
          });
        }
        break;
      default:
    }
    this.setState({ players: newPlayers });
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
    this.setState({ submitLoading: true });
    this.timer = setTimeout(() => {
      let self = this;
      const search = this.state.search.toLowerCase();
      const newPlayerPromise = this.lookupPlayer(search, currentGame);
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
            newState.getPlayers = [newPlayer.handle, ...prevState.getPlayers];
            newState.search = '';
          }
          localStorage.setItem('getPlayers', JSON.stringify(newState.getPlayers));
          return newState;
        });
      });
    }, 2000)
  }

  removePlayerHandler = (name) => {
    this.setState(prevState => {
      let players = [...prevState.players];
      let getPlayers = [...prevState.getPlayers];
      const playersRemoved = players.filter(player => player.handle !== name);
      const getPlayersRemoved = getPlayers.filter(getPlayer => getPlayer !== name);
      localStorage.setItem('getPlayers', JSON.stringify(getPlayersRemoved));
      return {
        players: playersRemoved,
        getPlayers: getPlayersRemoved
      };
    });
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

  lookupPlayer = (handle, game) => {
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
        const newPlayerPromise = this.lookupFortnitePlayer(handle);
        playerReturn = newPlayerPromise.then(function (newPlayer) {
          return { ...newPlayer, ...playerObj };
        });
        break;
      case 'rocketLeague':
        playerReturn = { ...this.lookupRocketLeaguePlayer(handle), ...playerObj };
        break;
      default:
    }
    return playerReturn;
  }

  lookupRocketLeaguePlayer = (playerObj) => {
    const playerData = {
      created: 1534342692889,
      stats: {
        wins: 555,
        goals: 666,
        mvps: 777,
        saves: 888,
        shots: 123,
        assists: 444
      },
      oldStats: {
        updated: 1534269698721,
        wins: 553,
        goals: 662,
        mvps: 774,
        saves: 881,
        shots: 121,
        assists: 441
      },
      ranks: {
        solo: {
          tier: 8,
          division: 2
        },
        duo: {
          tier: 10,
          division: 0
        },
        threes: {
          tier: 4,
          division: 3
        },
        solo3s: {
          tier: 9,
          division: 4
        }
      }
    }
    return {
      currentSeason: {
        updated: playerData.created,
        wins: playerData.stats.wins,
        goals: playerData.stats.goals,
        mvps: playerData.stats.mvps,
        saves: playerData.stats.saves,
        shots: playerData.stats.shots,
        assists: playerData.stats.assists
      },
      lastNight: {
        updated: playerData.oldStats.updated,
        wins: playerData.stats.wins - playerData.oldStats.wins,
        goals: playerData.stats.goals - playerData.oldStats.goals,
        mvps: playerData.stats.mvps - playerData.oldStats.mvps,
        saves: playerData.stats.saves - playerData.oldStats.saves,
        shots: playerData.stats.shots - playerData.oldStats.shots,
        assists: playerData.stats.assists - playerData.oldStats.assists
      },
      ranks: {
        solo: {
          tier: 8,
          division: 2
        },
        duo: {
          tier: 10,
          division: 0
        },
        threes: {
          tier: 4,
          division: 3
        },
        solo3s: {
          tier: 9,
          division: 4
        }
      }
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
        Object.keys(playerData.stats).forEach(function (key, index) {
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
          Object.keys(playerData.stats).forEach(function (key, index) {
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
        return playersMounted.map((handle, index) => {
          const newPlayerPromise = this.lookupPlayer(handle, currentGame);
          let self = this;
          return newPlayerPromise.then(function (newPlayer) {
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
      case 'rocketLeague':
        return playersMounted.map((handle, index) => {
          let self = this;
          const newPlayer = this.lookupPlayer(handle, currentGame);
          return setTimeout(function () {
            self.setState(prevState => {
              return {
                playersLoading: false,
                players: [...prevState.players, newPlayer],
                rocketLeaguePlayers: [...prevState.players, newPlayer]
              }
            });
          }, 1500);
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

    let buttonClasses = [classes.SearchButton];
    if (this.state.submitLoading) {
      buttonClasses.push(classes.Loading);
    }

    let players = (
      this.state.players.map((p, index) => {
        return <Grid item xs={12} key={p.name + index} zeroMinWidth>
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
        <div className={classes.PrimaryNav}>
          <h2 className={classes.MainTitle} onClick={this.gameToggleHandler}>{currentGame === 'rocketLeague' ? 'Rocket League' : currentGame} Stats</h2>
          <Button onClick={this.statsToggleHandler} variant="outlined" color="secondary" classes={{ root: classes.StatsToggle }}>
            {this.state.statsType === 'currentSeason' ? 'Totals' : 'Last 24 Hours'}
          </Button>
        </div>
        {!isComparing ? <form className={classes.SearchArea} noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
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

          <Button
            classes={{ root: buttonClasses.join(' ') }}
            variant="contained"
            color="primary"
            disabled={this.state.submitLoading}
            onClick={this.addPlayerHandler}>Search
          </Button>
          {this.state.submitSuccess ? <CheckCircle color="action" className={classes.CheckCircle} /> : null}
          {this.state.submitLoading && <CircularProgress size={24} className={classes.CircularProgress} />}
        </form> : null}

        {comparePlayersRender}
        {!isComparing ?

          <div className={classes.Players}>
            <Grid container
              justify="center"
              direction="column"
              alignItems="center"
              spacing={24}
            >
              {this.state.playersLoading ? <CircularProgress size={64} className={classes.PlayersCircularProgress} /> : players}
            </Grid>

          </div> : null}
      </Aux>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Players);
