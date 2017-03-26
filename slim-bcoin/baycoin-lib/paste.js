'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var writeData = function writeData(data) {
  return new _promise2.default(function (resolve, reject) {
    _child_process2.default.exec('echo \'' + data + '\' | ' + __dirname + '/../paste.sh -p', function (err, stdout, stderr) {
      var urlIndex = stdout.indexOf('https:');
      var pasteUrl = stdout.slice(urlIndex).trim();
      if (err !== null) {
        console.log('exec err: ' + err);
        reject(err);
      }
      resolve(pasteUrl);
    });
  });
};

var fetchData = function fetchData(pasteUrl) {
  return new _promise2.default(function (resolve, reject) {
    _child_process2.default.exec(__dirname + '/../paste.sh ' + pasteUrl, function (err, stdout, stderr) {
      stdout = stdout.trim();
      resolve(stdout);
    });
  });
};

var data = ['magnet:eafeafjaefjeaf&dn=Ubuntu+16', 'magnet:eafeafjaefjeaf&dn=Greatness+Behold', 'magnet:eafeafjaefjeaf&dn=Really+Awesome+Though'];

var compiledData = data.join("\n");
console.log('Writing data: ' + compiledData);
writeData(compiledData).then(function (url) {
  console.log(url);
  return fetchData(url);
}).then(function (url) {
  return console.log(url);
});

// fetchData("https://paste.sh/p_Ody2FvE")
//   .then(url => console.log(url));