import { decompile, fetchLink } from './baycoin';

export const writeMagnet = (name, magnet) => {
  fetchLink({type: 'addData', content: JSON.stringify({
    name,
    magnet
  })})
  // Creating new data to blockchain
  .then(data => {
    console.log(`Here's your HASH: ${data.hash}`);
  })
};

export const fetchTorrent = (hash, name) => {
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
}

export const searchMagnet = (name) => {
  fetchLink({type: 'getTrans'})
    .then(data => {
       // Loops through all data
      data.map(b => {
        fetchTorrent(b.hash, name);
      });
    });
}