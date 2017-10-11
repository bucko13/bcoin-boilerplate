'use strict';

const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'client/dist');
const APP_DIR = path.resolve(__dirname, 'client/react-src');

module.exports = {
  target: 'web',
  entry: path.resolve(APP_DIR, 'index.js'),
  output: {
    path: BUILD_DIR,
    filename: 'build.js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['-browser.js', '.js', '.json', '.jsx'],
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
