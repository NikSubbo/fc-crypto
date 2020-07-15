import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
} from '@material-ui/core';

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => (order === 'desc'
  ? (a, b) => descendingComparator(a, b, orderBy)
  : (a, b) => -descendingComparator(a, b, orderBy));

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tableHead: {
    backgroundColor: '#9e9e9e',
  },
  tableRow: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  font: {
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
      color: '#eeeeee',
    },
  },
}));

const CryptoTable = (props) => {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const { exchanges, markets } = props;

  let headCells;
  // eslint-disable-next-line no-unused-expressions
  exchanges ? headCells = [
    { id: 'rank', label: 'Rank' },
    { id: 'name', label: 'Name' },
    { id: 'tradingPairs', label: 'Trading Pairs' },
    { id: 'volumeUsd', label: 'Volume ($)' },
    { id: 'percentTotalVolume', label: 'Volume (%)' },
  ] : headCells = [
    { id: 'baseSymbol', label: 'Pair' },
    { id: 'priceQuote', label: 'Rate' },
    { id: 'priceUsd', label: 'Price' },
    { id: 'volumeUsd24Hr', label: 'Volume ($)' },
    { id: 'percentExchangeVolume', label: 'Volume (%)' },
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table}>

            <TableHead>
              <TableRow className={classes.tableHead}>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.id === 'rank' || headCell.id === 'baseSymbol' ? 'left' : 'right'}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={(e) => handleRequestSort(e, headCell.id)}
                      className={classes.font}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <span className={classes.visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {!markets ? stableSort(exchanges, getComparator(order, orderBy))
                .map((exchange) => (
                  <TableRow
                    hover
                    key={exchange.exchangeId}
                    className={classes.tableRow}
                    onClick={() => props.history.push(`markets/${exchange.exchangeId}`)}
                  >
                    <TableCell component="th" scope="row">
                      {exchange.rank}
                    </TableCell>
                    <TableCell align="right">{exchange.name}</TableCell>
                    <TableCell align="right">{exchange.tradingPairs}</TableCell>
                    <TableCell align="right">{Math.round(exchange.volumeUsd)}</TableCell>
                    <TableCell align="right">{Math.round(exchange.percentTotalVolume * 100) / 100}</TableCell>
                  </TableRow>
                )) : stableSort(markets, getComparator(order, orderBy))
                .map((market) => (
                  <TableRow
                    hover
                    key={market.rank}
                    className={classes.tableRow}
                    onClick={() => props.history.push(`${market.exchangeId}/d1/${market.baseId}/${market.quoteId}`)}
                  >
                    <TableCell component="th" scope="row">
                      {market.baseSymbol}
                      /
                      {market.quoteSymbol}
                    </TableCell>
                    <TableCell align="right">{market.priceQuote.toFixed(8)}</TableCell>
                    <TableCell align="right">{market.priceUsd.toFixed(8)}</TableCell>
                    <TableCell align="right">{Math.round(market.volumeUsd24Hr * 100) / 100}</TableCell>
                    <TableCell align="right">{Math.round(market.percentExchangeVolume * 100) / 100}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default CryptoTable;
