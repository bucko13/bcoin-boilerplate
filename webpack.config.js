'use strict';

const webpack = require('webpack')
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app')

const str = JSON.stringify;
const env = process.env;

module.exports = {
  target: 'web',
  entry: './client/react-src/index.js',
  },
  output: {
    path: path.join(__dirname, 'client','dist'),
    filename: 'build.js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['-browser.js', '.js', '.json']
  },
  plugins: [
    new UglifyJsPlugin({
      compress: {
        warnings: true
      }
    })
  ]
};
