import React from 'react';
import classes from './Playlist.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const playlist = (props) => {
  let tableRows = Object.keys(props.playlist).map(function(stat, key) {
    if (stat === 'updated') {
      return null;
    }
    return (
      <TableRow key={stat}>
        <TableCell component="th" scope="row">
          {stat}
        </TableCell>
        <TableCell numeric>
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
        </TableBody>
      </Table>
    </div>
  );
}

export default playlist;
