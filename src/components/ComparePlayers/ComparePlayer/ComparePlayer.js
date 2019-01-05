import React from 'react';
import classes from './ComparePlayer.css';
import Playlist from '../../Playlist/PlaylistCompared'
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const comparePlayer = (props) => {
  let playlists = [];
  let rangeString = '';
  let playerClasses = [classes.Player];
  let playlistArray = ['solo', 'duo', 'squad'];
  let startDate = new Date(props.player.lastNight.updated);
  let endDate = new Date(props.player.currentSeason.updated);
  let displayKey = props.displayType;

  rangeString = moment(startDate).calendar() + ' - ' + moment(endDate).calendar();
  if (props.playlistFilter) {
    playlistArray = [props.playlistFilter];
  }
  if (props.comparePlayers && props.comparePlayers.indexOf(props.player.handle) !== -1) {
    playerClasses = [classes.Compared];
  }
  playlistArray.forEach(function(playlistKey) {
    if (!props.player[displayKey][playlistKey] || !props.comparer[displayKey][playlistKey]) {
      return;
    }
    playlists.push(
      <Grid item xs={12} key={playlistKey}>
        <Card classes={{root: classes.Card}} raised={false}>
          <CardContent>
            <Playlist
              name={playlistKey}
              playlist={props.player[displayKey][playlistKey]}
              player={props.player.name}
              comparer={props.comparer[displayKey][playlistKey]} />
          </CardContent>
        </Card>
      </Grid>
    );
  });

  return (
    <div className={playerClasses.join(' ')} onClick={props.clicked ? () => props.clicked(props.player.handle) : null}>
      <Grid container spacing={24} justify="center">
        <Grid item xs={12}>
          <Typography align="center" variant="title" gutterBottom>
            {props.player.name}
          </Typography>
          {rangeString !== '' ? <Typography variant="caption" gutterBottom>({rangeString})</Typography> : null }
        </Grid>
        {props.player.error ? props.player.error : playlists}
      </Grid>
    </div>
  );
}

export default comparePlayer;
