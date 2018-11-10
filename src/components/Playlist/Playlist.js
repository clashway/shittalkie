import React from 'react';
import classes from './Playlist.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import seasonIcon from '../../assets/icons/s4-18.png';

const playlist = (props) => {
  let tableRows = Object.keys(props.playlist).map(function(stat, key) {
    if (props.ranks) {
      return (
        <TableRow key={stat}>
          <TableCell component="th" scope="row">
            {stat}
          </TableCell>
          <TableCell>
            <img className={classes.RankImage} src={seasonIcon} alt="rank_image" />
            <span className={classes.RankDivision}>division {props.playlist[stat].division}</span>
          </TableCell>
        </TableRow>
      );
    }
    else {
      if (stat === 'updated') {
        return false;
      }
      return (
        <TableRow key={stat}>
          <TableCell component="th" scope="row" padding="dense">
            {stat}
          </TableCell>
          <TableCell numeric>
            {props.playlist[stat]}
          </TableCell>
        </TableRow>
      );
    }
  });
  return (
    <div className={classes.Playlist}>
      <h3 className={classes.PlaylistTitle}>{props.name.toUpperCase()}</h3>
      <Table classes={{root: classes.PlaylistTable}}>
        <TableBody>
          {tableRows}
        </TableBody>
      </Table>
    </div>
  );
}

export default playlist;
