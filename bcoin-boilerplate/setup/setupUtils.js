'use strict';

const path = require('path');
const fs = require('fs');

// function to return the configurations object from default locations or npm_config param
module.exports.getConfig = () => {
  const pathToRoot = path.join(__dirname, '..');
  let config;
  if (process.env.npm_config_config) {
    config = String(process.env.npm_config_config);
  } else if (fs.existsSync(path.resolve(pathToRoot, './config.js'))) {
    config = './config.js';
  } else if (fs.existsSync(path.resolve(pathToRoot, './bcoin-config.js'))) {
    config = './bcoin-config.js';
  } else {
    throw new Error('Need a config file');
  }
  return require(path.resolve(pathToRoot, config));
};
