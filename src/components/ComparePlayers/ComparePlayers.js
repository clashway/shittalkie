import React from 'react';
import classes from './ComparePlayers.css';
import Player from '../Player/Player';

const comparePlayers = (props) => {
  const player1 = props.players[0];
  const player2 = props.players[1];
  return (
    <div className={classes.ComparePlayers}>
      <h2>{player1.name} vs {player2.name}</h2>
      {props.players.map((p, index) => {
        return <Player player={p}
          displayType={props.statsType}
          key={p.name + index}
          />
      })}
    </div>
  );
}

export default comparePlayers;
