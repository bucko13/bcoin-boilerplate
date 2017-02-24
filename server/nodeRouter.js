'use strict';

const express = require('express');
const request = require('request');
const auth = require('basic-auth');

const nodeRouter = express.Router({ mergeParams: true });
const bcoinPort = 8080;
const baseRequest = request.defaults({
  baseUrl: 'http://localhost:'.concat(bcoinPort),
});

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
  baseRequest(options, (err, resp, body) => {
    if (err) {
      return res.status(400).send({ error: err });
    }
    return res.status(200).json(body);
  });
});

module.exports = nodeRouter;
