import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import App from './App'

export default class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={App} exact />
        </Switch>
      </Router>
    )
  }
}
