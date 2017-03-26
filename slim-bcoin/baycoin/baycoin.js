import { mtx as MTX, script as Script } from 'bcoin';
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
      body: JSON.stringify(props.data),
    };

    baseRequest(options, (err, resp, body) => {
      if (err) reject(err);
      resolve(body);
    });
  });
};

const decompile = (hexx) => {
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
};

const writeLink = (link) => {
  return fetchLink(
      {
        type: 'addData', 
        content: JSON.stringify({link})
      })
  // Creating new data to blockchain
  .then(data => {
    //console.log(`Here's your data: ${data}`);
    data = JSON.parse(data.toString());
    //console.log(data['hash']);
    return data.hash;
    // return Promise.resolve(data.hash);
  })
};

const fetchTorrent = (hash, name) => {
  fetchLink({type: 'getData', hash})
    .then(data => {
      if (!data.outputs) return;
      try {
        // Remove the first 4 bytes as that is the OP_RETURN
        const json = JSON.parse(decompile(data.outputs[0].script.substring(4)));
        if (!name || json.name.toUpperCase().includes(name.toUpperCase())) {
          console.log(`Hash: ${data.hash}`);
          console.log(json);
        }
      } catch (err) {
        // console.log(err);
      }
    });
};

const searchLink = (name) => {
  fetchLink({type: 'getTrans'})
    .then(data => {
       // Loops through all data
      data.map(b => {
        fetchTorrent(b.hash, name);
      });
    });
};

export { writeLink, decompile, fetchTorrent, fetchLink, searchLink };
