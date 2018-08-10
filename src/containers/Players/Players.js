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
      // 'captainobvious13',
      // 'daemon chaos',
      // 'chapper15',
      // 'xvhand of godvx'
    ],
    // This will be the renderable players array.
    players: []
  }

  componentDidMount() {
    this.state.getPlayers.map((handle, index) => {
      let name = null;
      switch(handle) {
        case 'captainobvious13':
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

      // This is where we get the player data.
      const reqPath = 'https://api.fortnitetracker.com/v1/profile/xbl/' + handle;
      const apiKey = '883c5178-3127-46a1-82b5-f5faad23262c';
      let config = {
        headers: {
          'TRN-Api-Key': apiKey
        }
      }
      Axios.get(reqPath, config).then(function (response) {
        console.log(response);
      });
      const playerObj = {
        handle: handle,
        name: name,
        games: 3,
        kills: 5,
        deaths: 1
      };

      // Add new player to the array to be rendered.
      return this.setState(prevState => ({
        players: [...prevState.players, playerObj]
      }));
    });

  }

  render() {
    return (
      <Aux>
        <h2>Last Nights Stats</h2>
        <div className={classes.Players}>
          {this.state.players.map(p => {
            return <Player player={p} key={p.name} />
          })}
        </div>
      </Aux>
    );
  }
}

export default Players;
