import React from 'react';
import classes from './Playlist.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const playlistCompared = (props) => {
  const winner = {root: classes.Green};
  const loser = {root: classes.Red};
  let tableRows = Object.keys(props.playlist).map(function(stat, key) {
    return (
      <TableRow key={stat}>
        <TableCell component="th" scope="row">
          {stat}
        </TableCell>
        <TableCell classes={props.comparer[stat] === props.player ? winner : props.comparer[stat] !== 'tie' ? loser : null} numeric>
          {props.playlist[stat]}
        </TableCell>
      </TableRow>
    );
  });
  return (
    <div className={classes.Playlist}>
      <h3 className={classes.PlaylistTitle}>{props.name.toUpperCase()}</h3>
      <Table>
        <TableBody>
          {tableRows}
          {
            props.playlist.kd ?
              <TableRow key="kd">
                <TableCell component="th" scope="row">
                  kills/deaths
                </TableCell>
                <TableCell classes={props.comparer.kd === props.player ? winner : props.comparer.kd !== 'tie' ? loser : null} numeric>
                  {props.playlist.kd}
                </TableCell>
              </TableRow> : null
          }
        </TableBody>
      </Table>
    </div>
  );
}

export default playlistCompared;
