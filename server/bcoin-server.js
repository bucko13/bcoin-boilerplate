const bcoin = require('../bcoin/lib/bcoin');

const SPVNode = bcoin.spvnode;
const options = bcoin.config({
  network: 'testnet',
});
bcoin.set(options);

const node = new SPVNode(options);

node.on('error', () => {
  ; // eslint-disable-line no-extra-semi
});

// node.chain.on('block', (data) => {
//   console.log('got a block!', data);
// });

node.open().then(() => {
  node.connect().then(() => {
    node.startSync();
  });
});
const server = new bcoin.http.Server({ node });
const port = +process.argv[2] || 8080;

server.listen(port, '127.0.0.1');
