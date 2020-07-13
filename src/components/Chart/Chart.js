import React, { useState, useEffect } from 'react';
import ApexChart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Button, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  chart: {
    marginTop: theme.spacing(4),
  },
  btnLink: {
    textDecoration: 'none',
  },
  btn: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
}));

function Chart(props) {
  const [candles, setCandles] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const {
    exchangeId, interval, baseId, quoteId,
  } = props.match.params;

  const options = {
    chart: {
      type: 'candlestick',
      height: 350,
    },
    title: {
      text: `Exchange: ${exchangeId}, pair: ${baseId}/${quoteId}`,
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  const fetchData = async () => {
    setError(false);
    setLoading(true);
    try {
      const response = await fetch(`https://api.coincap.io/v2/candles?exchange=${exchangeId}&interval=${interval}&baseId=${baseId}&quoteId=${quoteId}`);
      if (!response.ok) throw Error();
      const { data } = await response.json();
      const arr = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < data.length; i++) {
        arr.push({
          x: new Date(data[i].period),
          y: [Math.round(data[i].open * 100000000) / 100000000,
            Math.round(data[i].high * 100000000) / 100000000,
            Math.round(data[i].low * 100000000) / 100000000,
            Math.round(data[i].close * 100000000) / 100000000],
        });
      }
      const result = {
        series: [{
          data: arr,
        }],
      };
      setCandles(result);
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      {error && <div> Sorry, request was failed </div>}
      {loading && <div> Loading... </div>}
      {!candles ? null : (
        <>
          <ApexChart className={classes.chart} options={options} series={candles.series} type="candlestick" height={350} />
          <Box className={classes.btn}>
            <Link className={classes.btnLink} to="/markets/binance">
              <Button variant="outlined" color="primary">
                Back to markets
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Container>
  );
}

export default Chart;
