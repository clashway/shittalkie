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

      Axios.get('/api/getPlayer?player=' + handle).then(function (response) {
        console.log(response);
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
