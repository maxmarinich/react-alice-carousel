const { merge } = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const configBase = require('./config.base');

const configDev = {
	mode: 'development',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'ts-loader'],
			},
		],
	},
	plugins: [
		new ESLintPlugin({ extensions: ['ts', 'tsx'] }),
		new HtmlWebPackPlugin({
			template: './public/index.html',
			filename: './index.html',
		}),
		new MiniCssExtractPlugin({ filename: 'style.css' }),
	],
};

module.exports = merge(configBase, configDev);
