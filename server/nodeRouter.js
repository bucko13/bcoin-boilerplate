const express = require('express');
const request = require('request');

const nodeRouter = express.Router({ mergeParams: true });
const bcoinPort = 8080;
const bcoinNode = 'http://localhost:'.concat(bcoinPort);
const baseRequest = request.defaults({
  baseUrl: bcoinNode,
});

nodeRouter.use((req, res, next) => {
  const options = {
    method: req.method,
    uri: req.path,
  };
  baseRequest(options, (err, resp, body) => {
    if (err) {
      return res.status(500).send({ error: err });
    }
    return res.status(200).json(JSON.parse(body));
  });
  next();
});

module.exports = nodeRouter;
