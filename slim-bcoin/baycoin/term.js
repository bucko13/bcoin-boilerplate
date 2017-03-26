import {writeMagnet, fetchTorrent, searchMagnet} from './scripts';

// Function Calls
// writeMagnet('Cool Link', 'magnet:blablabla');
// searchMagnet('link');
// fetchTorrent('36f2733343fdb2a1b55048f85551fd2acf5bc7caab674b1968b4aabdaf39803f');
switch(process.argv[2]) {
  case 'write':
    writeMagnet(process.argv[3], process.argv[4]);
    break;
  case 'search':
    searchMagnet(process.argv[3] ? process.argv[3] : '');
    break;
  case 'hash':
    fetchTorrent(process.argv[3]);
    break;
  default:
    console.log("I don't know what you are trying to do...");    
};