import { mtx as MTX, script as Script } from 'bcoin';
import { writeData, fetchData } from './paste';

const request = require('request');

// CONSTANTS
const id = 'primary';
const passphrase = 'primary';
const rate = '0.0001';
const token = '4022d3f1300495e42db532d279e50ac033a0fdd0a6c2d3f87b1904ddee16b854';
const bcoinPort = 18556;
const baseRequest = request.defaults({
  baseUrl: 'http://localhost:'.concat(bcoinPort),
});

const makeScript = (data) => {
  const opcodes = Script.opcodes;
  const script = new Script();
  script.push(opcodes.OP_RETURN);
  script.push(data);
  script.compile();

  return script.toJSON();
};

// Routing Links 

const fetchLink = (data) => {

  const propsMap = {
    addData: {
      type: 'POST',
      url: `/wallet/${id}/send`,
      data: {
        rate,
        token,
        passphrase,
        outputs: [{
          value: 0,
          script: data.content ? makeScript(data.content) : '',
        }],
      },
    },
    getData: {
      type: 'GET',
      url: `/tx/${data.hash}` 
    },
    getTrans: {
      type: 'GET',
      url: `/wallet/${id}/tx/history?token=${token}`
    }
  }; 

  var props = propsMap[data.type];

  return new Promise((resolve, reject) => {
    const options = {
      method: props.type,
      uri: props.url,
      body: props.data,
      json: true
    };
    // This is needed as creating a message doesn't allow JSON header to be set
    if (props.type === 'POST') delete options.json;

    baseRequest(options, (err, resp, body) => {
      if (err) reject(err);
      resolve(body);
    });
  });
};

// Converts the hex string back to ASCII (Human Readable) text
const decompile = (hexx) => {
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
};

// Writes magnet links to paste.sh
// paste.sh link stored into blockchain
// Format
/* magnet:...&dn={name}\n
 * magnet:...&dn={name}\n
 * magnet:...&dn={name}\n
 */
const writeLink = (data) => {
  return writeData(data)
    .then(url => {
      console.log(`Url: ${url}`);
      return fetchLink(
      {
        type: 'addData', 
        content: url
      })
    })
    // Creating new data to blockchain
    .then(data => {
      const dataObj = JSON.parse(data);
      console.log(`Here's your data: ${dataObj.hash}`);
      return dataObj.hash;
    })
};

// Search a transaction hash and extract the paste.sh URL
const searchHash = (hash, name) => {
  return fetchLink({type: 'getData', hash})
    .then(data => {
      if (!data.outputs) return;
      try {
        // Remove the first 4 bytes as that is the OP_RETURN
        const scriptContent = decompile(data.outputs[0].script.substring(4));
        if (scriptContent.includes('paste.sh')) {
          console.log(`Url: ${scriptContent}`);
          return fetchData(scriptContent);
        }
      } catch (err) {
        console.log(err);
      }
    });
};

// Search a wallet transaction history and sends it to searchHash to get the magnet links.
const searchLink = (name) => {
  return fetchLink({type: 'getTrans'})
    .then(data => {
       // Loops through all data
      return Promise.all(
        data.map(b => searchHash(b.hash, name))
      )
      // Ensure invalid transactions does not exit
      .then(data => {
        return data.filter(b => b);
      })
      // Flatten the array. [[1,2],[3,4]] => [1,2,3,4]
      .then(data => [].concat.apply([], data))
      // Filter the array based on name parameter
      .then(data => data.filter(b => !name || b.toLowerCase().includes(name.toLowerCase().replace(' ', '+'))))
      .then(magnetLinks => {
        console.log(magnetLinks);
        return magnetLinks;
      });
    });
};

export { writeLink, searchLink, searchHash };
