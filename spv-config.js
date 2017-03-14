module.exports = {
  prefix: '~/.bcoin/spv-testnet',
  network: 'testnet',
  walletauth: true,
  useWorkers: true,
  coinCache: 30000000,
  query: true,
  passphrase: 'testme',
  apiKey: 'testme',
  pruned: true,
  db: 'leveldb',
  logLevel: 'info',
  logFile: true,
};
