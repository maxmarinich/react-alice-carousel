const { resolve } = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const rootPath = resolve(__dirname, '../../')
const config = {
  stats: {
    maxModules: 0,
  },

  mode: 'production',

  entry: ['./lib/react-alice-carousel.js', './lib/scss/alice-carousel.scss'],

  output: {
    filename: 'react-alice-carousel.js',
    path: resolve(rootPath, 'lib'),
  },

  context: resolve(rootPath, 'app'),

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['css-hot-loader'].concat(
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'sass-loader',
                query: {
                  sourceMap: false,
                },
              },
            ],
          }),
        ),
      },
    ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin({ filename: '/alice-carousel.css', disable: false, allChunks: true }),
    new CopyWebpackPlugin([{ from: 'lib/types', to: 'types' }, { from: 'lib/scss', to: 'scss' }]),
  ],
}

module.exports = config
