import React from 'react';
import classes from './ComparePlayers.css';
import Player from '../Player/Player';
import Grid from '@material-ui/core/Grid';

const comparePlayers = (props) => {
  const player1 = props.players[0];
  const player2 = props.players[1];
  return (
    <div className={classes.ComparePlayers}>
      <h2>{player1.name} vs {player2.name}</h2>
      <Grid container spacing={8} justify="center">
        {props.players.map((p, index) => {
          return <Grid item lg={6} key={p.name + index}>
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
