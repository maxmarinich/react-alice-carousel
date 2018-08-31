'use strict';

const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';

const windows = {
  check: '√',
  cross: '×',
  info: 'i',
  line: '─',
  pointer: '>',
  pointerSmall: '»',
  question: '?',
  warning: '‼'
};

const other = {
  check: '✔',
  cross: '✖',
  info: 'ℹ',
  line: '─',
  pointer: isLinux ? '▸' : '❯',
  pointerSmall: isLinux ? '‣' : '›',
  question: '?',
  warning: '⚠'
};

module.exports = isWindows ? windows : other;
Reflect.defineProperty(module.exports, 'windows', { enumerable: false, value: windows });
Reflect.defineProperty(module.exports, 'other', { enumerable: false, value: other });
