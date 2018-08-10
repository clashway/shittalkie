import React from 'react';
import classes from './Player.css';
import Playlist from './Playlist/Playlist'
import Aux from '../../../hoc/Aux'

const player = (props) => {
  let playlists = null;
  if (props.player.error) {
    playlists = props.player.error;
  }
  else {
    playlists = (
      <Aux>
        <Playlist name="solo" playlist={props.player.solo} />
        <Playlist name="duo" playlist={props.player.duo} />
        <Playlist name="squad" playlist={props.player.squad} />
      </Aux>
    );
  }
  return (
    <div className={classes.Player}>
      <div className={classes.Name}>{props.player.name}</div>
      {playlists}
    </div>
  );
}

export default player;
