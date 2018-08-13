import React from 'react';
import classes from './Playlist.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const playlist = (props) => {
  return (
    <div className={classes.Playlist}>
      <h3 className={classes.PlaylistTitle}>{props.name}</h3>
      <Table>
        <TableBody>
          <TableRow key="games">
            <TableCell component="th" scope="row">
              games
            </TableCell>
            <TableCell numeric>
              {props.playlist.games}
            </TableCell>
          </TableRow>
          <TableRow key="kills">
            <TableCell component="th" scope="row">
              kills
            </TableCell>
            <TableCell numeric>
              {props.playlist.kills}
            </TableCell>
          </TableRow>
          <TableRow key="kpg">
            <TableCell component="th" scope="row">
              kills/game
            </TableCell>
            <TableCell numeric>
              {isNaN(props.playlist.kpg) ? 0 : props.playlist.kpg}
            </TableCell>
          </TableRow>
          <TableRow key="wins">
            <TableCell component="th" scope="row">
              wins
            </TableCell>
            <TableCell numeric>
              {props.playlist.wins}
            </TableCell>
          </TableRow>
          {
            props.playlist.kd ?
              <TableRow key="kd">
                <TableCell component="th" scope="row">
                  kills/deaths
                </TableCell>
                <TableCell numeric>
                  {props.playlist.kd}
                </TableCell>
              </TableRow> : null
          }
        </TableBody>
      </Table>
    </div>
  );
}

export default playlist;
