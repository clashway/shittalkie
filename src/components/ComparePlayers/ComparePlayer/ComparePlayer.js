import React from 'react';
import classes from './ComparePlayer.css';
import Playlist from '../../Playlist/Playlist'
import Aux from '../../../hoc/Aux'
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const comparePlayer = (props) => {
  let playlists = null;
  let rangeString = '';
  if (props.player.error) {
    playlists = props.player.error;
  }
  else {
    let startDate = new Date(props.player.lastNight.updated);
    let endDate = new Date(props.player.currentSeason.updated);
    rangeString = moment(startDate).calendar() + ' - ' + moment(endDate).calendar();

    let displayKey = props.displayType === 'total' ? 'currentSeason' : 'lastNight';
    if (props.playlistFilter) {
      playlists = (
        <Aux>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Playlist name={props.playlistFilter} playlist={props.player[displayKey][props.playlistFilter]} />
              </CardContent>
            </Card>
          </Grid>
        </Aux>
      );
    }
    else {
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
        playlists.push(<Grid item xs={12} md={itemSize} key={playlistKey}>
            <Card classes={{root: classes.Card}} raised={false}>
              <CardContent>
                <Playlist name={playlistKey} playlist={props.player[displayKey][playlistKey]} />
              </CardContent>
            </Card>
          </Grid>
        );
      });
    }
  }
  let playerClasses = [classes.Player];
  if (props.comparePlayers && props.comparePlayers.indexOf(props.player.handle) !== -1) {
    playerClasses = [classes.Compared];
  }
  return (
    <div className={playerClasses.join(' ')} onClick={props.clicked ? () => props.clicked(props.player.handle) : null}>
      <Grid container spacing={8} justify="center">
        <Grid item xs={12}>
          <Typography align="center" variant="title" gutterBottom>
            {props.player.name}
          </Typography>
          {rangeString !== '' ? <Typography variant="caption" gutterBottom>({rangeString})</Typography> : null }
        </Grid>
        {playlists}
      </Grid>
    </div>
  );
}

export default comparePlayer;
