import React from 'react';
import classes from './ComparePlayers.css';
import ComparePlayer from './ComparePlayer/ComparePlayer';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

const comparePlayers = (props) => {
  const player1 = props.players[0];
  const player2 = props.players[1];

  // Create comparer object.
  let comparer = JSON.parse(JSON.stringify(player1))
  Object.keys(player1[props.statsType]).forEach(function (playlist) {
    if (playlist === 'updated') {
      return;
    }
    Object.keys(player1[props.statsType][playlist]).forEach(function (stat) {
      comparer[props.statsType][playlist][stat] =
        Number(player1[props.statsType][playlist][stat]) > Number(player2[props.statsType][playlist][stat])
        ? player1.name
        : Number(player1[props.statsType][playlist][stat]) === Number(player2[props.statsType][playlist][stat])
          ? 'tie': player2.name;
    });
  });

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
        <Button variant="fab" size="small" onClick={props.cleared} aria-label="Delete" className={classes.DeleteButton}>
          <DeleteIcon />
        </Button>
      </div>

      <Grid container spacing={8} justify="center">
        {props.players.map((p, index) => {
          return <Grid item sm={6} md={props.playlistFilter ? 6 : 12} lg={6} key={p.name + index}>
            <ComparePlayer
              player={p}
              comparer={comparer}
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
