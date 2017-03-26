'use strict';

const config = require('../setup/setupUtils').getConfig();
const bcoin = require('bcoin');
const assert = require('assert');

const co = bcoin.utils.co;

// const util = bcoin.util;
const MTX = bcoin.mtx;
const Script = bcoin.script;
const Amount = bcoin.btc.Amount;
const FullNode = bcoin.fullnode;
const SPVNode = bcoin.spvnode;

let node;
if (process.env.npm_config_bcoin_node === 'spv') {
  node = new SPVNode(config);
} else {
  node = new FullNode(config);
}

const walletdb = node.use(bcoin.walletplugin);
node.on('error', () => {
  ; // eslint-disable-line no-extra-semi
});

node.pool.on('open', () => {
  console.log('pool opened'); // eslint-disable-line no-console
});

if (node instanceof FullNode) {
  // eslint-disable-next-line no-unused-vars
  node.mempool.on('tx', (tx) => {
    // console.log('******** Saw tx: ', tx);
  });
}

node.chain.on('block', () => {
  // console.log('new block found. Chain State tx: ', node.chain.tip);
});

node.ensure()
.then(() => node.open())
.then(() => node.connect())
.then(() => node.startSync());

node.http.post('/multisig/:id', co(function* postMultisig(req, res) {
  const passphrase = req.body.passphrase;
  const rate = Amount.value(req.body.rate);
  const destination = req.body.destination;
  const sendAmount = Amount.value(req.body.amount);
  const wallets = req.body.wallets;
  const multisig = yield walletdb.get(req.params.id);
  const flags = Script.flags.STANDARD_VERIFY_FLAGS;

  // create the mutable tx and add payee output to it
  const mtx = new MTX();
  mtx.addOutput(destination, sendAmount);
  assert(!mtx.verify(flags));

  // fund and sign the mtx with the multisig wallet
  yield multisig.fund(mtx, { rate, round: true });
  yield multisig.sign(mtx, passphrase);
  assert(!mtx.verify(flags));

  // cycle through each of the additional wallets sent in the request for signing
  if (wallets && wallets.length) {
    for (let i = 0; i < wallets.length; i++) {
      const signer = yield walletdb.get(wallets[i].id);
      const pass = wallets[i].passphrase;
      yield signer.sign(mtx, pass);
    }
  }

  // make transaction immutable and send
  const view = mtx.view;
  const tx = mtx.toTX();
  assert(tx.verify(view, flags));

  yield node.sendTX(tx);
  res.send(200, { tx });
}));
