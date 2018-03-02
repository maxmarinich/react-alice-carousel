const path = require('path');
const webpack = require('webpack');


module.exports = {
  context: path.join(__dirname, 'source'),
  entry: [
    'webpack-hot-middleware/client',
    'babel-polyfill',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'index.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader'
      },
      {
        loaders: ['babel-loader'],
        include: [
          path.resolve(__dirname, 'source'),
        ],
        test: /\.js$/,
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(scss|sass)$/,
        use: ['postcss-loader']
      }
    ]
  }
};
