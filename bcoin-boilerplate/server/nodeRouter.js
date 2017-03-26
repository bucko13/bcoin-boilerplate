'use strict';

const express = require('express');
const request = require('request');
const auth = require('basic-auth');
const API_KEY = require('../setup/setupUtils').getConfig().apiKey;

process.env.BCOIN_CONFIG = process.env.npm_config_config;
// require('request').debug = true;

const nodeRouter = express.Router({ mergeParams: true });
const bcoinPort = 8080;
const baseRequest = request.defaults({
  baseUrl: 'http://localhost:'.concat(bcoinPort),
});
nodeRouter.get('/tx/:hash', (req, res) => {
  const blockcypherEndpoint = 'https://api.blockcypher.com/v1/btc/test3/txs/'
    .concat(req.params.hash);
  request(blockcypherEndpoint,
    (err, response, body) => res.status(200).json(JSON.parse(body)));
});

nodeRouter.use((req, res) => {
  let authorization;

  if (API_KEY) {
    authorization = {
      user: '',
      pass: API_KEY,
    };
  } else if (auth(req)) {
    authorization = {
      user: auth(req).name,
      pass: auth(req).pass,
      sendImmediately: false,
    };
  }
  const options = {
    method: req.method,
    uri: req.path,
    body: req.body,
    json: true,
    qs: req.query,
    auth: authorization,
  };
  baseRequest(options, (err, resp, body) => {
    if (err) {
      return res.status(400).send({ error: err });
    }

    return res.status(200).json(body);
  });
});

module.exports = nodeRouter;
