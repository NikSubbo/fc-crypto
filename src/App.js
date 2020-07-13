import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Exchanges from './components/Exchanges/Exchanges';
import Markets from './components/Markets/Markets';
import Chart from './components/Chart/Chart';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Exchanges} />
      <Route exact path="/markets/:exchangeId" component={Markets} />
      <Route exact path="/markets/:exchangeId/:interval/:baseId/:quoteId" component={Chart} />
    </Switch>
  );
}

export default App;
