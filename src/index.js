import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Routes from './common/Routes'

const render = (Component) => {
  window.__DEBUG__ = true
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  )
}

render(Routes)

if (module.hot) {
  module.hot.accept('./common/Routes', () => {
    const newApp = require('./common/Routes')
    render(newApp.default)
  })
}
