import React, { Component } from 'react';
import Aux from '../../hoc/Aux'
import Player from './Player/Player';
import classes from './Players.css'
import Axios from 'axios';

class Players extends Component {
  state = {
    // Handles to retrieve.
    getPlayers: [
      'lash24',
      'captainobvs13',
      'daemon chaos',
      'chapper15',
      'xvhand of godvx'
    ],
    // This will be the renderable players array.
    players: [],
    statsType: 'lastNight'
  }

  statsToggleHandler = () => {
    this.setState((prevState) => {
      return {
        statsType: prevState.statsType === 'total' ? 'lastNight' : 'total'
      };
    });
  }

  componentDidMount() {
    this.state.getPlayers.map((handle, index) => {
      let name = null;
      switch(handle) {
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
        default:
          name = 'No alias yet.';
      }
      const reqPath = "https://shitalkie-591a0.firebaseapp.com/api/getPlayer?player=";
      // const reqPath = '/api/getPlayer?player=';
      return Axios.get(reqPath + handle).then((response) => {
        const playerData = response.data;
        if (playerData.error) {
          this.setState(prevState => ({
            players: [...prevState.players, {
              handle: handle,
              name: name,
              error: playerData.error
            }]
          }));
          return false;
        }
        const playerObj = {
          handle: handle,
          name: name,
          currentSeason : {
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
        };

        // Add new player to the array to be rendered.
        this.setState(prevState => ({
          players: [...prevState.players, playerObj]
        }));
      });
    });
  }

  render() {
    return (
      <Aux>
        <h2>Fort Nite Stats ({this.state.statsType === 'total' ? 'S5 Totals' : 'Last Night'})</h2>
        <button onClick={this.statsToggleHandler}>Toggle Stats</button>

        <div className={classes.Players}>
          {this.state.players.map(p => {
            return <Player player={p} displayType={this.state.statsType} key={p.name} />
          })}
        </div>
      </Aux>
    );
  }
}

export default Players;
