'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchHash = exports.searchLink = exports.writeLink = undefined;

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

var fetchLink = function fetchLink(data) {

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
      body: (0, _stringify2.default)(props.data),
      json: true
    };

    baseRequest(options, function (err, resp, body) {
      if (err) reject(err);
      resolve(body);
    });
  });
};

var decompile = function decompile(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }return str;
};

var writeLink = function writeLink(link) {
  return fetchLink({
    type: 'addData',
    content: (0, _stringify2.default)({ link: link })
  })
  // Creating new data to blockchain
  .then(function (data) {
    //console.log(`Here's your data: ${data}`);
    data = JSON.parse(data.toString());
    //console.log(data['hash']);
    return data.hash;
    // return Promise.resolve(data.hash);
  });
};

var searchHash = function searchHash(hash, name) {
  return fetchLink({ type: 'getData', hash: hash }).then(function (data) {
    if (!data.outputs) return;
    try {
      // Remove the first 4 bytes as that is the OP_RETURN
      var json = JSON.parse(decompile(data.outputs[0].script.substring(4)));
      if (!name || json.name.toUpperCase().includes(name.toUpperCase())) {
        console.log('Hash: ' + data.hash);
        // console.log(json);
        return json;
      }
    } catch (err) {
      // console.log(err);
    }
  });
};

var searchLink = function searchLink(name) {
  fetchLink({ type: 'getTrans' }).then(function (data) {
    // Loops through all data
    return _promise2.default.all(data.map(function (b) {
      return searchHash(b.hash, name);
    })).then(function (data) {
      return data.filter(function (b) {
        return b;
      });
    });
  });
};

exports.writeLink = writeLink;
exports.searchLink = searchLink;
exports.searchHash = searchHash;