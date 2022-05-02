const { merge } = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const configBase = require('./config.base');

const configDev = {
	mode: 'development',
	devtool: 'source-map',
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				loader: 'eslint-loader',
			},
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'awesome-typescript-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: './public/index.html',
			filename: './index.html',
		}),
		new MiniCssExtractPlugin({ filename: 'style.css' }),
	],
};

module.exports = merge(configBase, configDev);
