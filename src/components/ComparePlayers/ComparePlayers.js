import React from 'react';
import classes from './ComparePlayers.css';
import Player from '../Player/Player';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const comparePlayers = (props) => {
  const player1 = props.players[0];
  const player2 = props.players[1];
  return (
    <div className={classes.ComparePlayers}>
      <div className={classes.CompareNav}>
        <h2 className={classes.CompareTitle}>{player1.name} vs {player2.name}</h2>
        <Select className={classes.PlaylistFilter} value={props.playlistFilter} displayEmpty onChange={props.changed}>
          <MenuItem value="">Playlist Filter</MenuItem>
          <MenuItem value="solo">SOLO</MenuItem>
          <MenuItem value="duo">DUO</MenuItem>
          <MenuItem value="squad">SQUAD</MenuItem>
        </Select>
      </div>

      <Grid container spacing={8} justify="center">
        {props.players.map((p, index) => {
          return <Grid item sm={6} md={props.playlistFilter ? 6 : 12} key={p.name + index}>
            <Player
              player={p}
              displayType={props.statsType}
              playlistFilter={props.playlistFilter}
              />
          </Grid>
        })}
      </Grid>
    </div>
  );
}

export default comparePlayers;
