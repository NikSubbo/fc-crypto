import React, { useState, useEffect } from 'react';
import { Container, Box } from '@material-ui/core';
import Table from '../Table/Table';

const Markets = (props) => {
  const [markets, setMarkets] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { history } = props;
  const { exchangeId } = props.match.params;

  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      setLoading(true);
      try {
        const response = await fetch(`https://api.coincap.io/v2/markets?exchangeId=${exchangeId}`);
        if (!response.ok) throw Error();
        const data = (await response.json()).data.map((market) => ({
          ...market,
          priceQuote: Number(market.priceQuote),
          priceUsd: Number(market.priceUsd),
          volumeUsd24Hr: Number(market.volumeUsd24Hr),
          percentExchangeVolume: Number(market.percentExchangeVolume),
        }));
        setMarkets(data);
      } catch (err) {
        setError(true);
      }
      setLoading(false);
    };

    fetchData();
  }, [exchangeId]);

  return (
    <Container>
      {error && <Box> Sorry, request was failed. </Box>}
      {loading && <Box> Loading... </Box>}
      {markets.length > 0 && <Table markets={markets} history={history} />}
      {markets.length === 0 && (
        <Box>
          Exchange
          {' '}
          {exchangeId}
          : markets are closed.
        </Box>
      )}
    </Container>
  );
};

export default Markets;
