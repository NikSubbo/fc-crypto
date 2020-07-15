import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Exchanges from './components/Exchanges/Exchanges';
import Markets from './components/Markets/Markets';
import Chart from './components/Chart/Chart';
import Navbar from './components/Navbar/Navbar';

const App = () => (
  <>
    <Navbar />
    <Switch>
      <Route path="/markets/:exchangeId/:interval/:baseId/:quoteId" component={Chart} />
      <Route path="/markets/:exchangeId" component={Markets} />
      <Route path="/" component={Exchanges} />
    </Switch>
  </>
);

export default App;
