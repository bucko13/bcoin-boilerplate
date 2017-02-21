const bcoin = require('bcoin');
const API_KEY = require('../config.js').BCOIN_API_KEY;

const SPVNode = bcoin.spvnode;

const options = bcoin.config({
  network: 'testnet',
  walletauth: true,
  passphrase: API_KEY,
  apiKey: API_KEY,
  // logLevel: 'info',
});
bcoin.set(options);

const node = new SPVNode(options);
const walletdb = bcoin.walletdb({
  location: process.env.HOME.concat('/walletdb'),
  db: 'leveldb',
  name: 'my wallet db',
});

node.walletdb = walletdb;

node.on('error', () => {
  ; // eslint-disable-line no-extra-semi
});
node.open()
.then(() => {
  node.connect().then(() => {
    node.startSync();
  });
});
const server = new bcoin.http.Server({ node });
const port = +process.argv[2] || 8080;

server.listen(port, '127.0.0.1');
