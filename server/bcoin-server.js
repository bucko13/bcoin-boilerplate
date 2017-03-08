'use strict';
const bcoin = require('bcoin');
const API_KEY = require('../config.js').BCOIN_API_KEY;
// const assert = require('assert');
// const request = require('request');

// const co = bcoin.utils.co;
const FullNode = bcoin.fullnode;
// const MTX = bcoin.mtx;
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
  logLevel: 'debug',
  logFile: true,
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

// node.http.post('/multisig/:id', co(function* postMultisig(req, res) {
//   const txOptions = {
//     passphrase: req.body.passphrase,
//     rate: req.body.rate,
//     outputs: req.body.outputs,
//   };
//   const wallets = req.body.wallets;
//   const multisig = yield node.walletdb.get(req.params.id);
//   const mtx = yield multisig.createTX(txOptions);

//   console.log('here is the mtx: ', mtx);

//   yield multisig.sign(mtx, txOptions.passphrase);
//   console.log('signed the mtx', mtx);
//   // if (!mtx.isSigned())
//   //   throw new Error('TX could not be fully signed.');
//   wallets.forEach(co(function* signTx(wallet) {
//     const signer = yield node.walletdb.get(wallet.id);
//     const pass = wallet.passphrase;

//     yield signer.sign(mtx, pass);
//   }));
//   assert(mtx.verify());
//   // console.log('************ verify? ', mtx.verify());
//   const tx = mtx.toTX();
//   const result = yield node.sendTX(tx);

//   res.send(200, { result });
// }));

node.http.listen(port, '127.0.0.1');
