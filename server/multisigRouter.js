const express = require('express');
const SPVNode = require('bcoin').spvnode;
// const prefix = require('../config.js').prefix;
const API_KEY = require('../config.js').API_KEY;

const multisigRouter = express.Router({ mergeParams: true });

const options = {
  network: 'testnet',
  walletauth: true,
  useWorkers: true,
  coinCache: 30000000,
  query: true,
  passphrase: API_KEY,
  apiKey: API_KEY,
  pruned: true,
  db: 'leveldb',
  // logLevel: 'debug',
  logFile: true,
};

const spv = new SPVNode(options);

spv.on('error', err => console.log(err));

multisigRouter.get('/wallet/:id', (req, res) => {
  const id = req.params.id;
  console.log('got this param id from req: ', id);
  spv.open()
  .then(() => spv.walletdb.getWallets())
  .then((wallets) => {
    console.log('wallets from the walletdb: ', wallets);
    console.log('wallet: ', spv.walletdb.get(id));
    return spv.walletdb.get(id);
  })
  .then(wallet => res.status(200).json(wallet));
});

module.exports = multisigRouter;
