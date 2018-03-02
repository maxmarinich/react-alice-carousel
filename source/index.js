import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './js/app';
import './style/main.scss';


render(
    <AppContainer><App /></AppContainer>,
  document.getElementById('carousel')
);

if(module.hot) { module.hot.accept(); }
