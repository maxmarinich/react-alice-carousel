const webpack = require('webpack');
const config = require('./webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');


const compiler = webpack(config);
const port = process.env.PORT || 3000;
const app = new (require('express'))();

app.use(webpackHotMiddleware(compiler));
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));


app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html')
});

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
});
