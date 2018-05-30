'use strict';

const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'client/dist');
const APP_DIR = path.resolve(__dirname, 'client/react-src');

module.exports = {
  target: 'web',
  watch: true,
  devtool: 'source-map',
  entry: path.resolve(APP_DIR, 'index.js'),
  output: {
    path: BUILD_DIR,
    filename: 'build.js',
  },
  resolve: {
    extensions: ['-browser.js', '.js', '.json', '.jsx'],
    alias: {
      bcoin: path.resolve(__dirname, 'node_modules/bcoin/lib/bcoin-browser'),
    },
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: APP_DIR,
        loader: 'babel-loader',
      },
    ],
  },
};
