import React from 'react';
import classes from './Player.css';
import Playlist from '../Playlist/Playlist'
import Aux from '../../hoc/Aux'
import moment from 'moment';

const player = (props) => {
  let playlists = null;
  let rangeString = '';
  if (props.player.error) {
    playlists = props.player.error;
  }
  else {
    console.log(props.player);
    let startDate = new Date(props.player.lastNight.updated);
    let endDate = new Date(props.player.currentSeason.updated);
    rangeString = moment(startDate).calendar() + ' - ' + moment(endDate).calendar();

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
      <div>
        <span className={classes.Name}>{props.player.name}</span>
        <span className={classes.Range}>({rangeString})</span>
      </div>
      {playlists}
    </div>
  );
}

export default player;
