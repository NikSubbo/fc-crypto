import React, { useState, useEffect } from 'react';
import { Container } from '@material-ui/core';
import Table from '../Table/Table';

function Markets(props) {
  const [markets, setMarkets] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { history } = props;

  const fetchData = async () => {
    setError(false);
    setLoading(true);
    try {
      const response = await fetch(`https://api.coincap.io/v2/markets?exchangeId=${props.match.params.exchangeId}`);
      if (!response.ok) throw Error();
      const { data } = await response.json();
      setMarkets(data);
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
      {!markets ? null : <Table markets={markets} history={history} />}
    </Container>
  );
}

export default Markets;
