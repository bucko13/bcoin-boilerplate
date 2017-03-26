import { writeLink, searchLink, searchHash } from './baycoin';

// Function Calls
// writeLink('Cool Link', 'magnet:blablabla');
// searchLink('link');
// searchHash('36f2733343fdb2a1b55048f85551fd2acf5bc7caab674b1968b4aabdaf39803f');
switch(process.argv[2]) {
  case 'write':
    writeLink(process.argv[3], process.argv[4]);
    break;
  case 'search':
    searchLink(process.argv[3] ? process.argv[3] : '');
    break;
  case 'hash':
    console.log( searchHash(process.argv[3]) );
    break;
  default:
    console.log("I don't know what you are trying to do...");    
};