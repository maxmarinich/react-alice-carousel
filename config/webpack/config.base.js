const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const marked = require('marked');

module.exports = {
	entry: ['./src/index.tsx'],
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							implementation: require('dart-sass'),
						},
					},
				],
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: { minimize: false },
					},
				],
			},
			{
				test: /\.md$/,
				use: [
					{
						loader: 'html-loader',
					},
					{
						loader: 'markdown-loader',
						options: {
							renderer: new marked.Renderer(),
							highlight: function (code, language) {
								const hljs = require('highlight.js');
								const validLanguage = hljs.getLanguage(language) ? language : 'javascript';
								return hljs.highlight(validLanguage, code).value;
							},
							pedantic: false,
							gfm: true,
							breaks: false,
							sanitize: false,
							smartLists: true,
							smartypants: false,
							xhtml: false,
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
	},
};
