import React from 'react';
import classes from './Playlist.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const playlistCompared = (props) => {
  const winner = {root: classes.Green};
  const loser = {root: classes.Red};
  return (
    <div className={classes.Playlist}>
      <h3 className={classes.PlaylistTitle}>{props.name.toUpperCase()}</h3>
      <Table>
        <TableBody>
          <TableRow key="games">
            <TableCell component="th" scope="row">
              games
            </TableCell>
            <TableCell classes={props.comparer.games === props.player ? winner : loser} numeric>
              {props.playlist.games}
            </TableCell>
          </TableRow>
          <TableRow key="kills">
            <TableCell component="th" scope="row">
              kills
            </TableCell>
            <TableCell classes={props.comparer.kills === props.player ? winner : loser} numeric>
              {props.playlist.kills}
            </TableCell>
          </TableRow>
          <TableRow key="kpg">
            <TableCell component="th" scope="row">
              kills/game
            </TableCell>
            <TableCell classes={props.comparer.kpg === props.player ? winner : loser} numeric>
              {isNaN(props.playlist.kpg) ? 0 : props.playlist.kpg}
            </TableCell>
          </TableRow>
          <TableRow key="wins">
            <TableCell component="th" scope="row">
              wins
            </TableCell>
            <TableCell classes={props.comparer.wins === props.player ? winner : loser} numeric>
              {props.playlist.wins}
            </TableCell>
          </TableRow>
          {
            props.playlist.kd ?
              <TableRow key="kd">
                <TableCell component="th" scope="row">
                  kills/deaths
                </TableCell>
                <TableCell classes={props.comparer.kd === props.player ? winner : loser} numeric>
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
