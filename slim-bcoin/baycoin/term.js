/*
 * This file is a terminal variant to our frontend
 * 
 */

import { writeLink, searchLink, searchHash } from './baycoin';
import util from 'util';

// Fetches a list of magnet links from terminal
function getMagnets() {
  let magnets = [];
  console.log("Pump me Magnet Links (type 'q' to end):")
  return new Promise((resolve, reject) => {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', text => {
      let content = text.trim();
      if (content === 'q') resolve(magnets);
      else magnets.push(content);
    });
  });
}

// Function Calls
// writeLink('Cool Link', 'magnet:blablabla');
  // SAMPLE Data to use writeLink
  // const magnetLinks = [
  //   'magnet:eafeafjaefjeaf&dn=New+Last+Try',
  //   'magnet:eafeafjaefjeaf&dn=New+I+Need+To+Go',
  //   'magnet:eafeafjaefjeaf&dn=New+Well+Well+Well',
  // ]
// searchLink('{text}');
// searchHash('36f2733343fdb2a1b55048f85551fd2acf5bc7caab674b1968b4aabdaf39803f');
switch(process.argv[2]) {
  case 'write':
    getMagnets()
      .then(magnets => writeLink(magnets.join("\n")))
      .then(() => process.exit());
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