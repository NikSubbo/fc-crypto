import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
  toolbar: {
    backgroundColor: '#d50000',
  },
  title: {
    flexGrow: 1,
    color: 'white',
  },
  link: {
    textDecoration: 'none',
  },
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Link to="/" className={classes.link}>
            <Typography edge="start" variant="h6" className={classes.title}>
              FC Crypto
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
