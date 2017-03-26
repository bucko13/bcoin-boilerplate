'use strict';

var _bcoin = require('bcoin');

var makeScript = function makeScript(data) {
  var opcodes = _bcoin.script.opcodes;
  var script = new _bcoin.script();
  script.push(opcodes.OP_RETURN);
  script.push(data);
  script.compile();
  return script.toJSON();
};
