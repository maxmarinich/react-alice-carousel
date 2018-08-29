module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", "css"],
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },

};
