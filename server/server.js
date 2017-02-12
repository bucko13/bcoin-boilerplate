const express = require('express');
const path = require('path');
// const bcoin = require('../bcoin/lib/bcoin');

const app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.listen(app.get('port'), '127.0.0.1', () => {
  console.log('Node app is running on port', app.get('port'));
});
