import React from 'react';
import classes from './Player.css';
import Playlist from '../Playlist/Playlist'
import Aux from '../../hoc/Aux'
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const player = (props) => {
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
    playlists = (
      <Aux>
        <Grid item md={4}>
          <Card>
            <CardContent>
              <Playlist name="solo" playlist={props.player[displayKey].solo} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={4}>
          <Card>
            <CardContent>
              <Playlist name="duo" playlist={props.player[displayKey].duo} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={4}>
          <Card>
            <CardContent>
              <Playlist name="squad" playlist={props.player[displayKey].squad} />
            </CardContent>
          </Card>
        </Grid>
      </Aux>
    );
  }
  let playerClasses = [classes.Player];
  if (props.comparePlayers && props.comparePlayers.indexOf(props.player.handle) !== -1) {
    playerClasses.push(classes.Compared);
  }
  return (
    <div className={playerClasses.join(' ')} onClick={() => props.clicked(props.player.handle)}>
      <Grid container spacing={16} justify="center">
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

export default player;
