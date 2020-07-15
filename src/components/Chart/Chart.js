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

const Chart = (props) => {
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

  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      setLoading(true);
      try {
        const response = await fetch(`https://api.coincap.io/v2/candles?exchange=${exchangeId}&interval=${interval}&baseId=${baseId}&quoteId=${quoteId}`);
        if (!response.ok) throw Error();
        const { data } = await response.json();
        const chartData = data.map((item) => ({
          x: new Date(item.period),
          y: [
            Math.round(item.open * 100000000) / 100000000,
            Math.round(item.high * 100000000) / 100000000,
            Math.round(item.low * 100000000) / 100000000,
            Math.round(item.close * 100000000) / 100000000,
          ],
        }));
        const result = {
          series: [{
            data: chartData,
          }],
        };
        setCandles(result);
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };

    fetchData();
  }, [exchangeId, interval, baseId, quoteId]);

  return (
    <Container>
      {error && <Box> Sorry, request was failed. </Box>}
      {loading && <Box> Loading... </Box>}
      {candles && candles.series[0].data.length > 0 && (
        <>
          <ApexChart className={classes.chart} options={options} series={candles.series} type="candlestick" height={350} />
          <Box className={classes.btn}>
            <Link className={classes.btnLink} to={`/markets/${exchangeId}`}>
              <Button variant="outlined" color="primary">
                Back to markets
              </Button>
            </Link>
          </Box>
        </>
      )}
      {candles && candles.series[0].data.length === 0 && (
        <Box>
          Exchange
          {' '}
          {exchangeId}
          : chart for
          {baseId}
          /
          {quoteId}
          {' '}
          pair is unavailable.
        </Box>
      )}
    </Container>
  );
};

export default Chart;
