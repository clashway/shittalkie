import React, { Component } from 'react';
import classes from './Player.css';
import Playlist from '../Playlist/Playlist'
import Aux from '../../hoc/Aux'
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class Player extends Component {
  render() {
    let playlists = null;
    let rangeString = '';
    let nextUpdate = '';
    if (this.props.player.error) {
      playlists = this.props.player.error;
    }
    else {
      let startDate = new Date(this.props.player.lastNight.updated);
      let endDate = new Date(this.props.player.currentSeason.updated);
      rangeString = moment(startDate).calendar() + ' - ' + moment(endDate).calendar();
      nextUpdate = moment(new Date(endDate)).add(15, 'm');
      nextUpdate = moment(nextUpdate).format('hh:mma');

      let displayKey = this.props.displayType;
      if (this.props.playlistFilter) {
        playlists = (
          <Aux>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Playlist name={this.props.playlistFilter} playlist={this.props.player[displayKey][this.props.playlistFilter]} />
                </CardContent>
              </Card>
            </Grid>
          </Aux>
        );
      }
      else {
        playlists = [];
        const numPlaylists = Object.keys(this.props.player[displayKey]).length;
        const playlistArray = ['solo', 'duo', 'squad'];
        let itemSize = 4;
        if (numPlaylists === 2) {
          itemSize = 6;
        }
        if (numPlaylists === 1) {
          itemSize = 12;
        }
        const self = this;
        playlistArray.forEach(function(playlistKey) {
          if (!self.props.player[displayKey][playlistKey]) {
            return;
          }
          playlists.push(<Grid item md={itemSize} key={playlistKey}>
              <Card classes={{root: classes.Card}} raised={false}>
                <CardContent>
                  <Playlist name={playlistKey} playlist={self.props.player[displayKey][playlistKey]} />
                </CardContent>
              </Card>
            </Grid>
          );
        });
      }
    }
    let playerClasses = [classes.Player];
    if (this.props.comparePlayers && this.props.comparePlayers.indexOf(this.props.player.handle) !== -1) {
      playerClasses = [classes.Compared];
    }
    return (
      <div className={playerClasses.join(' ')} onClick={this.props.clicked ? () => this.props.clicked(this.props.player.handle) : null}>
        <Grid container spacing={16} justify="center">
          <Grid item xs={12}>
            <Typography align="center" variant="title" gutterBottom>
              {this.props.player.name}
            </Typography>
            {rangeString !== '' ? <Typography variant="caption" gutterBottom>{rangeString} <span className={classes.NextUpdate}>(next update at {nextUpdate})</span></Typography> : null }
          </Grid>
          {playlists}
        </Grid>
      </div>
    );
  }
}

export default Player;
