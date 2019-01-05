import React from 'react';
import classes from './Player.css';
import Playlist from '../Playlist/Playlist'
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import XboxIcon from '../../assets/icons/xbox.png';
import PcIcon from '../../assets/icons/pc.png';

const Player = (props) => {
  const getFortnitePlaylists = () => {
    const displayKey = props.displayType;
    const playlistArray = ['solo', 'duo', 'squad'];
    let playlists = [];
    const itemSize = 4;

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

    playlistArray.forEach(function (playlistKey) {
      if (!props.player[displayKey][playlistKey]) {
        return;
      }
      playlists.push(<Grid item xs={6} sm={itemSize} key={playlistKey}>
        <Card classes={{ root: classes.Card }} raised={false}>
          <CardContent>
            <Playlist name={playlistKey} playlist={props.player[displayKey][playlistKey]} />
          </CardContent>
        </Card>
      </Grid>
      );
    });
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
  const timeOutput = getTimeOutput();

  const getPlatformOutput = () => {
    let platformRender;
    switch (props.player.platform) {
      case 'xbl':
        platformRender = <img className={classes.PlatformImage} src={XboxIcon} alt="xbox" />;
        break;
      case 'pc':
        platformRender = <img className={classes.PlatformImage} src={PcIcon} alt="pc" />;
        break;
      default:
        platformRender = '';
    }
    return platformRender;
  }
  const platformRender = getPlatformOutput();

  let playlists = null;
  switch (props.game) {
    case 'fortnite':
      playlists = getFortnitePlaylists();
      break;
    default:
  }

  let playerClasses = [classes.Player];
  var isCompared = props.comparePlayers.some(function (comparePlayer) {
    if (comparePlayer.handle === props.player.handle && comparePlayer.platform === props.player.platform) {
      return true;
    }
    return false;
  });
  if (props.comparePlayers && isCompared) {
    playerClasses = [classes.Compared];
  }

  return (
    <div className={playerClasses.join(' ')}>
      <Grid container spacing={16} justify="center">
        <Grid item xs={12}>
          <span className={classes.PlayerUtilitiesLeft}>
            <Button onClick={props.clicked ? () => props.clicked(props.player.handle, props.player.platform) : null} variant="outlined" size="small" color="secondary" classes={{ root: classes.PlayerCompareButton }}>
              compare
            </Button>
          </span>
          <Typography className={classes.PlayerHeading} variant="title" gutterBottom>
            <span className={classes.PlayerName}>{props.player.name}</span>
            <span className={classes.PlayerPlatform}>{platformRender}</span>
          </Typography>
          <span className={classes.PlayerUtilitiesRight}>
            <Button onClick={props.removed ? () => props.removed(props.player.handle, props.player.platform) : null} variant="outlined" size="small" color="secondary" classes={{ root: classes.PlayerCompareButton }}>
              remove
            </Button>
          </span>
          <div className={classes.TimeInfo}>
            {timeOutput}
          </div>
        </Grid>
        {playlists}
      </Grid>
    </div>
  );
}

export default Player;
