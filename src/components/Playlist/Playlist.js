import React from 'react';
import classes from './Playlist.css'

const playlist = (props) => {
  return (
    <div className={classes.Playlist}>
      <h3>{props.name}</h3>
      <div>games: {props.playlist.games}</div>
      <div>kills: {props.playlist.kills}</div>
      <div>kills/game: {props.playlist.kpg}</div>
      <div>wins: {props.playlist.wins}</div>
      {props.playlist.kd ? <div> k/d: {props.playlist.kd} </div> : null }
    </div>
  );
}

export default playlist;
