import React, { Component } from 'react';
import classes from './Player.css';
import Playlist from '../Playlist/Playlist'
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const Player = (props) => {
  const getFortnitePlaylists = () => {
    let playlists = null;
    let displayKey = props.displayType;

    if (props.playlistFilter) {
      return (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Playlist name={props.playlistFilter} playlist={props.player[displayKey][props.playlistFilter]} />
            </CardContent>
          </Card>
        </Grid>
      );
    }

    playlists = [];
    const numPlaylists = Object.keys(props.player[displayKey]).length;
    const playlistArray = ['solo', 'duo', 'squad'];
    let itemSize = 4;
    if (numPlaylists === 2) {
      itemSize = 6;
    }
    if (numPlaylists === 1) {
      itemSize = 12;
    }
    playlistArray.forEach(function(playlistKey) {
      if (!props.player[displayKey][playlistKey]) {
        return;
      }
      playlists.push(<Grid item xs={6} md={itemSize} key={playlistKey}>
          <Card classes={{root: classes.Card}} raised={false}>
            <CardContent>
              <Playlist name={playlistKey} playlist={props.player[displayKey][playlistKey]} />
            </CardContent>
          </Card>
        </Grid>
      );
    });
    return playlists;
  }

  const getRocketLeaguePlaylists = () => {
    let playlists = [];
    playlists.push(
        <Grid item xs={6} key="ranks">
          <Card classes={{root: classes.Card}} raised={false}>
            <CardContent>
              <Playlist name={'Summary'} playlist={props.player[props.displayType]} />
            </CardContent>
          </Card>
        </Grid>
    );
    playlists.push(
        <Grid item xs={6} key="summary">
          <Card classes={{root: classes.Card}} raised={false}>
            <CardContent>
              <Playlist name={'Ranks'} playlist={props.player.ranks} ranks={true} />
            </CardContent>
          </Card>
        </Grid>
    );
    return playlists;
  }

  const getTimeOutput = () => {
    let output = null;
    let rangeString = '';
    let nextUpdate = '';
    let startDate = new Date(props.player.lastNight.updated);
    let endDate = new Date(props.player.currentSeason.updated);
    rangeString = moment(startDate).calendar() + ' - ' + moment(endDate).calendar();
    if (rangeString) {
      nextUpdate = moment(new Date(endDate)).add(15, 'm');
      nextUpdate = moment(nextUpdate).format('hh:mma');
      output = (<Typography variant="caption" gutterBottom>
                {rangeString} <span className={classes.NextUpdate}>(next update at {nextUpdate})</span>
              </Typography>
      );
    }
    return output;
  }

  let playlists = null;
  switch (props.game) {
    case 'rocketLeague':
      playlists = getRocketLeaguePlaylists();
      break;
    case 'fortnite':
      playlists = getFortnitePlaylists();
      break;
    default:
  }
  const timeOutput = getTimeOutput();

  let playerClasses = [classes.Player];
  if (props.comparePlayers && props.comparePlayers.indexOf(props.player.handle) !== -1) {
    playerClasses = [classes.Compared];
  }
  return (
    <div className={playerClasses.join(' ')} onClick={props.clicked ? () => props.clicked(props.player.handle) : null}>
      <Grid container spacing={16} justify="center">
        <Grid item xs={12}>
          <Typography align="center" variant="title" gutterBottom>
            {props.player.name}
          </Typography>
          {timeOutput}
        </Grid>
        {playlists}
      </Grid>
    </div>
  );
}

export default Player;
