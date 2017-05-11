import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import { configureStore } from './store';
import { PoC } from './containers/PoC';
import { PoC2 } from './containers/PoC2';
import { PoC3 } from './containers/PoC3';
import { PoCSequence } from './containers/PoC_sequence';
import { CleanPoC } from './containers/CleanPoC';

const store = configureStore();
const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/sequence" component={PoCSequence} />
        <Route path="/third" component={PoC3} />
        <Route path="/second" component={PoC2} />
        <Route path="/first" component={PoC} />
        <Route path="/" component={CleanPoC} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
