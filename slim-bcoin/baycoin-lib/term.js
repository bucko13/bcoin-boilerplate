'use strict';

var _scripts = require('./scripts');

// Function Calls
// writeMagnet('Cool Link', 'magnet:blablabla');
// searchMagnet('link');
// fetchTorrent('36f2733343fdb2a1b55048f85551fd2acf5bc7caab674b1968b4aabdaf39803f');
switch (process.argv[2]) {
  case 'write':
    (0, _scripts.writeMagnet)(process.argv[3], process.argv[4]);
    break;
  case 'search':
    (0, _scripts.searchMagnet)(process.argv[3] ? process.argv[3] : '');
    break;
  case 'hash':
    (0, _scripts.fetchTorrent)(process.argv[3]);
    break;
  default:
    console.log("I don't know what you are trying to do...");
};