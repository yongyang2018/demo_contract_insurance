const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  // plugins: [
  //   new CopyWebpackPlugin([{ from: "./src/html/index.html", to: "index.html" }]),
  // ],
  devServer: { contentBase: path.join(__dirname, '/src/'), compress: true, open: true, openPage: 'html/index.html',index:"html/index.html" },
  // devServer: { contentBase: path.join(__dirname, '/src/'), compress: true },
  externals : {
    'jquery' : 'window.jQuery'
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.s?css$/, use: [ 'style-loader', 'css-loader' ] },
      {test: /\.(png|jpg)$/,
        　　　　　　loader: 'url-loader?limit=8192'},
        {
          test: /\.(htm|html)$/i,
           use:[ 'html-withimg-loader'] 
      }
    ],

  },
  node: {
    __dirname: true,
    fs: 'empty',
  }
};
