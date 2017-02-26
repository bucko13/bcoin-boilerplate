const bcoin = require('bcoin');
const API_KEY = require('../config.js').BCOIN_API_KEY;

const FullNode = bcoin.fullnode;
const port = +process.argv[2] || 8080;

const options = bcoin.config({
  network: 'testnet',
  walletauth: true,
  useWorkers: true,
  coinCache: 30000000,
  query: true,
  passphrase: API_KEY,
  apiKey: API_KEY,
  pruned: true,
  db: 'leveldb',
  logLevel: 'info',
});
bcoin.set(options);

const node = new FullNode(options);

node.on('error', () => {
  ; // eslint-disable-line no-extra-semi
});

node.pool.on('open', () => {
  console.log('pool opened');
});

node.mempool.on('tx', (tx) => {
  // console.log('******** Saw tx: ', tx);
});


node.chain.on('block', () => {
  // console.log('new block found. Chain State tx: ', node.chain.tip);
});

node.open()
.then(() => node.connect())
.then(() => node.startSync());

node.http.listen(port, '127.0.0.1');
