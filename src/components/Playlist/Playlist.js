import React from 'react';
import classes from './Playlist.css'

const playlist = (props) => {
  return (
    <div className={classes.Playlist}>
      <h3>{props.name}</h3>
      <div>
        <div><span className={classes.Label}>games:</span><span className={classes.Value}>{props.playlist.games}</span></div>
        <div><span className={classes.Label}>kills:</span><span className={classes.Value}>{props.playlist.kills}</span></div>
        <div><span className={classes.Label}>k/g:</span><span className={classes.Value}>{isNaN(props.playlist.kpg) ? 0 : props.playlist.kpg}</span></div>
        <div><span className={classes.Label}>wins:</span><span className={classes.Value}>{props.playlist.wins}</span></div>
        {props.playlist.kd ? <div><span className={classes.Label}>k/d:</span><span className={classes.Value}>{props.playlist.kd}</span></div> : null }
      </div>
    </div>
  );
}

export default playlist;
