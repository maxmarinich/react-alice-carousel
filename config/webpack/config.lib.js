const { resolve } = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const rootPath = resolve(__dirname, '../../');

module.exports = {
	mode: 'none',
	entry: ['./lib/react-alice-carousel.tsx', './lib/scss/alice-carousel.scss'],
	output: {
		filename: 'react-alice-carousel.js',
		path: resolve(rootPath, 'lib'),
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
	},
	context: resolve(rootPath, 'src'),
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					'babel-loader',
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						},
					},
				],
			},
			{
				test: /\.(sa|sc|c)ss$/,
				exclude: /node_modules/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
		],
	},
	externals: {
		react: 'react',
		reactDOM: 'react-dom',
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new MiniCssExtractPlugin({ filename: 'alice-carousel.css' }),
		new CopyWebpackPlugin({
			patterns: [{ from: 'lib/scss', to: 'scss' }],
		}),
	],
};
