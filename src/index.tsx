import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, Switch } from 'react-router'
import { createBrowserHistory } from 'history'
import { configureStore } from './store'
import PoC from './containers/PoC'

const store = configureStore()
const history = createBrowserHistory()

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route path="/" component={PoC} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
)
