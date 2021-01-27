const { resolve } = require('path');
const { merge } = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const configBase = require('./config.base');

const filename = '[name].[hash:4]';

const configStatic = {
	output: {
		path: resolve(__dirname, '../../', 'static'),
		filename: `${filename}.js`,
		publicPath: '',
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					'babel-loader',
					{
						loader: 'awesome-typescript-loader',
						options: {
							transpileOnly: true,
						},
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: `${filename}.css`,
		}),
		new HtmlWebPackPlugin({
			template: './public/index.html',
			filename: './index.html',
		}),
		new HtmlWebPackPlugin({
			template: './public/index.redirect.html',
			filename: './static/index.html',
		}),
	],
};

module.exports = merge(configBase, configStatic);
