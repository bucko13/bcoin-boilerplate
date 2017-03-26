'use strict';

const config = require('../setup/setupUtils').getConfig();
const bcoin = require('bcoin');
const assert = require('assert');

const co = bcoin.utils.co;
const MTX = bcoin.mtx;
const Script = bcoin.script;
const FullNode = bcoin.fullnode;
const SPVNode = bcoin.spvnode;

const port = process.argv[2] || 8080;

const options = bcoin.config(config);
bcoin.set(options);

let node;
if (process.env.npm_config_bcoin_node === 'spv') {
  node = new SPVNode(options);
} else {
  node = new FullNode(options);
}

node.on('error', () => {
  ; // eslint-disable-line no-extra-semi
});

node.pool.on('open', () => {
  console.log('pool opened');
});

if (node instanceof FullNode) {
  node.mempool.on('tx', (tx) => {
    // console.log('******** Saw tx: ', tx);
  });
}

node.chain.on('block', () => {
  // console.log('new block found. Chain State tx: ', node.chain.tip);
});

node.open()
.then(() => node.connect())
.then(() => node.startSync());

node.http.post('/multisig/:id', co(function* postMultisig(req, res) {
  const passphrase = req.body.passphrase;
  const rate = req.body.rate;
  const destination = req.body.destination;
  const sendAmount = Number(req.body.amount);
  const wallets = req.body.wallets;
  const multisig = yield node.walletdb.get(req.params.id);
  const flags = Script.flags.STANDARD_VERIFY_FLAGS;

  // create the mutable tx and add payee output to it
  const mtx = new MTX();
  mtx.addOutput(destination, sendAmount);
  assert(!mtx.verify(flags));

  // fund and sign the mtx with the multisig wallet
  yield multisig.fund(mtx, { rate: 10000, round: true });
  yield multisig.sign(mtx, passphrase);
  assert(!mtx.verify(flags));

  // cycle through each of the additional wallets sent in the request for signing
  if (wallets && wallets.length) {
    wallets.forEach(co(function* signTx(wallet) {
      const signer = yield node.walletdb.get(wallet.id);
      const pass = wallet.passphrase;

      yield signer.sign(mtx, pass);
    }));
  }

  // check that our mtx is valid
  // assert(mtx.verify(), 'MTX did not verify after signatures');

  // make transaction immutable and send
  const tx = mtx.toTX();
  assert(tx.verify(mtx.view, flags));
  const result = yield node.sendTX(tx);

  res.send(200, { result });
}));

node.http.listen(port, '127.0.0.1');
