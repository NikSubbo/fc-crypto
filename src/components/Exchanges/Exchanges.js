import React, { useState, useEffect } from 'react';
import { Container, Box } from '@material-ui/core';
import Table from '../Table/Table';

const Exhanges = (props) => {
  const [exchanges, setExhanges] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { history } = props;

  const fetchData = async () => {
    setError(false);
    setLoading(true);
    try {
      const response = await fetch('https://api.coincap.io/v2/exchanges');
      if (!response.ok) throw Error();
      const data = (await response.json()).data.map((exchange) => ({
        ...exchange,
        percentTotalVolume: Number(exchange.percentTotalVolume),
        rank: Number(exchange.rank),
        tradingPairs: Number(exchange.tradingPairs),
        volumeUsd: Number(exchange.volumeUsd),
      }));
      setExhanges(data);
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
      {error && <Box> Sorry, request was failed. </Box>}
      {loading && <Box> Loading... </Box>}
      {exchanges && <Table exchanges={exchanges} history={history} />}
    </Container>
  );
};

export default Exhanges;
