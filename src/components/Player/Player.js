import React from 'react';
import classes from './Player.css';
import Playlist from '../Playlist/Playlist'
import Aux from '../../hoc/Aux'

const player = (props) => {
  let playlists = null;
  if (props.player.error) {
    playlists = props.player.error;
  }
  else {
    let displayKey = props.displayType === 'total' ? 'currentSeason' : 'lastNight';
    playlists = (
      <Aux>
        <Playlist name="solo" playlist={props.player[displayKey].solo} />
        <Playlist name="duo" playlist={props.player[displayKey].duo} />
        <Playlist name="squad" playlist={props.player[displayKey].squad} />
      </Aux>
    );
  }
  let playerClasses = [classes.Player];
  if (props.comparePlayers && props.comparePlayers.indexOf(props.player.handle) !== -1) {
    playerClasses.push(classes.Compared);
  }
  return (
    <div className={playerClasses.join(' ')} onClick={() => props.clicked(props.player.handle)}>
      <div className={classes.Name}>{props.player.name}</div>
      {playlists}
    </div>
  );
}

export default player;
