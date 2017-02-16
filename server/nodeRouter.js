const express = require('express');
const request = require('request');

const nodeRouter = express.Router({ mergeParams: true });
const bcoinPort = 8080;
const baseRequest = request.defaults({
  baseUrl: 'http://localhost:'.concat(bcoinPort),
});

nodeRouter.use((req, res) => {
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
});

module.exports = nodeRouter;
