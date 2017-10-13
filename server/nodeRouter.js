'use strict';

const express = require('express');
const request = require('request');
const auth = require('basic-auth');
const Client = require('bcoin').http.Client;

const config = require('../setup/setupUtils').getConfig();

const bcoinClient = new Client({ network: config.network });
const nodeRouter = express.Router({ mergeParams: true });

// custom route to get tx info since most of the time you won't be indexing
nodeRouter.get('/tx/:hash', (req, res) => {
  const blockcypherEndpoint = 'https://api.blockcypher.com/v1/btc/test3/txs/'
    .concat(req.params.hash);
  request(blockcypherEndpoint,
    (err, response, body) => res.status(200).json(JSON.parse(body)));
});

// Primary router for preparing the requests to send to bcoin node
nodeRouter.use((req, res) => {
  let authorization;

  if (auth(req)) {
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

  const baseRequest = request.defaults({
    baseUrl: bcoinClient.uri,
  });

  baseRequest(options, (err, resp, body) => {
    if (err) {
      return res.status(400).send({ error: err });
    }
    return res.status(200).json(body);
  });
});

module.exports = nodeRouter;
