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
      body: JSON.stringify(props.data),
      json: true
    };
    if (props.type === 'POST') delete options.json;

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

const searchHash = (hash, name) => {
  return fetchLink({type: 'getData', hash})
    .then(data => {
      if (!data.outputs) return;
      try {
        // Remove the first 4 bytes as that is the OP_RETURN
        // const json = JSON.parse(decompile(data.outputs[0].script.substring(4)));
        const scriptContent = decompile(data.outputs[0].script.substring(4));
        if (scriptContent.includes('paste.sh')) {
          console.log(`Url: ${scriptContent}`);
          return fetchData(scriptContent);
        }
      } catch (err) {
        // console.log(err);
      }
    });
};

const searchLink = (name) => {
  return fetchLink({type: 'getTrans'})
    .then(data => {
       // Loops through all data
      return Promise.all(
        data.map(b => searchHash(b.hash, name))
      )
      .then(data => {
        return data.filter(b => b);
      })
      // Flatten the array
      .then(data => [].concat.apply([], data))
      // Filter the array
      .then(data => data.filter(b => !name || b.toLowerCase().includes(name.toLowerCase().replace(' ', '+'))))
      .then(magnetLinks => {
        console.log(magnetLinks);
        return magnetLinks;
      });
    });
};

export { writeLink, searchLink, searchHash };
