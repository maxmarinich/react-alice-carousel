'use strict';

const colors = { enabled: true, visible: true, styles: {} };

const ansi = codes => {
  codes.open = `\u001b[${codes[0]}m`;
  codes.close = `\u001b[${codes[1]}m`;
  codes.regex = new RegExp(`\\u001b\\[${codes[1]}m`, 'g');
  return codes;
};

const wrap = (style, str, nl) => {
  let { open, close, regex } = style;
  str = open + (str.includes(close) ? str.replace(regex, open) : str) + close;
  // see https://github.com/chalk/chalk/pull/92, thanks to the
  // chalk contributors for this fix. However, we've confirmed that
  // this issue is also present in Windows terminals
  return nl ? str.replace(/\r?\n/g, `${close}$&${open}`) : str;
};

const style = (input, stack) => {
  if (colors.enabled === false) return input;
  if (colors.visible === false) return '';
  let str = '' + input;
  let nl = str.includes('\n');
  let n = stack.length;
  while (n-- > 0) str = wrap(colors.styles[stack[n]], str, nl);
  return str;
};

const define = (name, codes) => {
  colors.styles[name] = ansi(codes);
  Reflect.defineProperty(colors, name, {
    get() {
      let color = input => style(input, color.stack);
      Reflect.setPrototypeOf(color, colors);
      color.stack = this.stack ? this.stack.concat(name) : [name];
      return color;
    }
  });
};

define('reset', [0, 0]);
define('bold', [1, 22]);
define('dim', [2, 22]);
define('italic', [3, 23]);
define('underline', [4, 24]);
define('inverse', [7, 27]);
define('hidden', [8, 28]);
define('strikethrough', [9, 29]);

define('black', [30, 39]);
define('red', [31, 39]);
define('green', [32, 39]);
define('yellow', [33, 39]);
define('blue', [34, 39]);
define('magenta', [35, 39]);
define('cyan', [36, 39]);
define('white', [37, 39]);
define('gray', [90, 39]);
define('grey', [90, 39]);

define('bgBlack', [40, 49]);
define('bgRed', [41, 49]);
define('bgGreen', [42, 49]);
define('bgYellow', [43, 49]);
define('bgBlue', [44, 49]);
define('bgMagenta', [45, 49]);
define('bgCyan', [46, 49]);
define('bgWhite', [47, 49]);

define('blackBright', [90, 39]);
define('redBright', [91, 39]);
define('greenBright', [92, 39]);
define('yellowBright', [93, 39]);
define('blueBright', [94, 39]);
define('magentaBright', [95, 39]);
define('cyanBright', [96, 39]);
define('whiteBright', [97, 39]);

define('bgBlackBright', [100, 49]);
define('bgRedBright', [101, 49]);
define('bgGreenBright', [102, 49]);
define('bgYellowBright', [103, 49]);
define('bgBlueBright', [104, 49]);
define('bgMagentaBright', [105, 49]);
define('bgCyanBright', [106, 49]);
define('bgWhiteBright', [107, 49]);

// ansiRegex modified from node.js readline: https://git.io/fNWFP
colors.ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
colors.unstyle = val => typeof val === 'string' ? val.replace(colors.ansiRegex, '') : val;
colors.symbols = require('./symbols');
module.exports = colors;
