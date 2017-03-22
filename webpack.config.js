const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


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
                enforce: "pre",
                loader: "eslint-loader"
            },
            {
                loaders: ['react-hot-loader', 'babel-loader'],
                include: [
                    path.resolve(__dirname, "source"),
                ],
                test: /\.js$/,
            },
            {
                test: /\.(scss|sass)$/,
                use: process.env.NODE_ENV === 'production' ?
                    ExtractTextPlugin.extract({
                      fallback: 'style-loader',
                      use: ['css-loader', 'sass-loader'],
                      publicPath: '/static/'
                    }):
                    ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(scss|sass)$/,
                use: ['postcss-loader']
            }
        ]
    }
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true,
                drop_debugger: true,
                dead_code: true
            }
        }),
        new ExtractTextPlugin({
            filename: "carousel.css",
            disable: false,
            allChunks: true
        })
    );
}
