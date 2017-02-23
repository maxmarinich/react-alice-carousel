import React from 'react';
import { render } from 'react-dom';
import { App } from './js/app';
import './style/main.scss';


render(
  <App />,
  document.getElementById('carousel')
);

if(module.hot) { module.hot.accept(); }
