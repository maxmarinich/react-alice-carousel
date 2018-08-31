'use strict';

var react = require('react');

global.window = global;

window.addEventListener = function () {};
window.requestAnimationFrame = function () {
  throw new Error('requestAnimationFrame is not supported in Node');
};

module.exports = react;