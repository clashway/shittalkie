import React from 'react';
import classes from './Player.css';

const player = (props) => {
  const playerKD = Math.round(props.player.kills / props.player.deaths * 100) / 100;
  const playerKG = Math.round(props.player.kills / props.player.games * 100) / 100

  let overall = 'no bueno';
  if (playerKD >= 1 && playerKG < 1) {
    overall = 'quit playing scared';
  }
  if (playerKD >= 1 && playerKG >= 1) {
    overall = 'you da best';
  }

  return (
    <div className={classes.Player}>
      <div className={classes.Name}>{props.player.name}</div>
      <div>games: {props.player.games}</div>
      <div>kills: {props.player.kills}</div>
      <div>deaths: {props.player.deaths}</div>
      <div>k/d: {playerKD}</div>
      <div>kills/game: {playerKG}</div>
      <div className={classes.Total}>{overall}</div>
    </div>
  );
}

export default player;
