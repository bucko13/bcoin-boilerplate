'use strict';

const config = require('../setup/setupUtils').getConfig();
const bcoin = require('bcoin');

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

node.http.listen(port, '127.0.0.1');
