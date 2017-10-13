module.exports = {
  network: 'regtest',
  port: 48332,
  useWorkers: true,
  coinCache: 30000000,
  query: true,
  pruned: true,
  db: 'leveldb',
  logLevel: 'info',
  logFile: true,
  listen: true,
  prefix: '~/.bcoin/boilerplate',
};
