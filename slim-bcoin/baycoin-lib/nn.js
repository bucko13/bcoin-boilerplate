'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decompile = exports.fetchLink = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _bcoin = require('bcoin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('request');

// CONSTANTS
var id = 'primary';
var passphrase = 'primary';
var rate = '0.0001';
var token = '4022d3f1300495e42db532d279e50ac033a0fdd0a6c2d3f87b1904ddee16b854';
var bcoinPort = 18556;
var baseRequest = request.defaults({
  baseUrl: 'http://localhost:'.concat(bcoinPort)
});

var makeScript = function makeScript(data) {
  var opcodes = _bcoin.script.opcodes;
  var script = new _bcoin.script();
  script.push(opcodes.OP_RETURN);
  script.push(data);
  script.compile();

  return script.toJSON();
};

// Routing Links
var fetchLink = exports.fetchLink = function fetchLink(data) {
  var propsMap = {
    addData: {
      type: 'POST',
      url: '/wallet/' + id + '/send',
      data: {
        rate: rate,
        token: token,
        passphrase: passphrase,
        outputs: [{
          value: 0,
          script: data.content ? makeScript(data.content) : ''
        }]
      }
    },
    getData: {
      type: 'GET',
      url: '/tx/' + data.hash
    },
    getTrans: {
      type: 'GET',
      url: '/wallet/' + id + '/tx/history?token=' + token
    }
  };

  var props = propsMap[data.type];

  return new _promise2.default(function (resolve, reject) {
    var options = {
      method: props.type,
      uri: props.url,
      body: props.data,
      json: true
    };

    baseRequest(options, function (err, resp, body) {
      if (err) reject(err);
      resolve(body);
    });
  });
};

var decompile = exports.decompile = function decompile(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }return str;
};

var writeMagnet = function writeMagnet(name, magnet) {
  fetchLink({ type: 'addData', content: (0, _stringify2.default)({
      name: name,
      magnet: magnet
    }) })
  // Creating new data to blockchain
  .then(function (data) {
    console.log('Here\'s your HASH: ' + data.hash);
    // return Promise.resolve(data.hash);
  });
};