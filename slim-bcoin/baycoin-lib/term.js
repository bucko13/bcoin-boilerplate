'use strict';

var _baycoin = require('./baycoin');

// Function Calls
// writeLink('Cool Link', 'magnet:blablabla');
// searchLink('link');
// searchHash('36f2733343fdb2a1b55048f85551fd2acf5bc7caab674b1968b4aabdaf39803f');
switch (process.argv[2]) {
  case 'write':
    (0, _baycoin.writeLink)(process.argv[3], process.argv[4]);
    break;
  case 'search':
    (0, _baycoin.searchLink)(process.argv[3] ? process.argv[3] : '');
    break;
  case 'hash':
    console.log((0, _baycoin.searchHash)(process.argv[3]));
    break;
  default:
    console.log("I don't know what you are trying to do...");
};