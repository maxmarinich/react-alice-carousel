import React from 'react';
import { render } from 'react-dom';
import { App } from './js/structure/app';
require('./style/main.scss');


render(
  <App />,
  document.getElementById('carousel')
);

if(module.hot) { module.hot.accept(); }
