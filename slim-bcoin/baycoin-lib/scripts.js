'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchMagnet = exports.fetchTorrent = exports.writeMagnet = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _baycoin = require('./baycoin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var writeMagnet = exports.writeMagnet = function writeMagnet(name, magnet) {
  (0, _baycoin.fetchLink)({ type: 'addData', content: (0, _stringify2.default)({
      name: name,
      magnet: magnet
    }) })
  // Creating new data to blockchain
  .then(function (data) {
    console.log('Here\'s your HASH: ' + data.hash);
  });
};

var fetchTorrent = exports.fetchTorrent = function fetchTorrent(hash, name) {
  (0, _baycoin.fetchLink)({ type: 'getData', hash: hash }).then(function (data) {
    if (!data.outputs) return;
    try {
      // Remove the first 4 bytes as that is the OP_RETURN
      var json = JSON.parse((0, _baycoin.decompile)(data.outputs[0].script.substring(4)));
      if (!name || json.name.toUpperCase().includes(name.toUpperCase())) {
        console.log('Hash: ' + data.hash);
        console.log(json);
      }
    } catch (err) {
      // console.log(err);
    }
  });
};

var searchMagnet = exports.searchMagnet = function searchMagnet(name) {
  (0, _baycoin.fetchLink)({ type: 'getTrans' }).then(function (data) {
    // Loops through all data
    data.map(function (b) {
      fetchTorrent(b.hash, name);
    });
  });
};