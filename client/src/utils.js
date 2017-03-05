// bcoin objects
/* globals
bcoin
*/

const MTX = bcoin.mtx;
const Script = bcoin.script;

const getWalletId = form => form.find('input.wallet-id').val();
const getWalletPassphrase = form => form.find('input.wallet-passphrase').val();
const getRate = form => form.find('input[name="fee"]').val();
const getAddress = form => form.find('input[name="destination"]').val();
const getValue = form => form.find('input[name="tx-amount"]').val();
const getM = form => form.find('input[name="m"]').val();
const getN = form => form.find('input[name="n"]').val();
const getAccountKey = form => form.find('input[name="accountKey"]').val();
const getTx = form => form.find('textarea[name="tx"]').val();
const getData = form => form.find('textarea[name="data"]').val();

const makeScript = (data) => {
  const opcodes = Script.opcodes;
  const script = new Script();
  script.push(opcodes.OP_RETURN);
  script.push(data);
  script.compile();

  return script.toJSON();
};

export const reqUrl = (form, action) => {
  const nodeEndpoint = '/node';

  const endpointMap = {
    createWallet: '/wallet',
    getWallet: `/wallet/${getWalletId(form)}`,
    getAddress: `/wallet/${getWalletId(form)}/address`,
    sendTx: `/wallet/${getWalletId(form)}/send`,
    createMultisig: '/node/wallet',
    addKey: `/node/wallet/${getWalletId(form)}/shared-key`,
    createTx: `/wallet/${getWalletId(form)}/create`,
    signTx: `/wallet/${getWalletId(form)}/sign`,
    addData: `/wallet/${getWalletId(form)}/send`,
  };
  return nodeEndpoint.concat(endpointMap[action]);
};

export const reqData = (form, action) => {
  const id = getWalletId(form);
  const passphrase = getWalletPassphrase(form);
  const rate = getRate(form);
  const address = getAddress(form);
  const value = getValue(form);
  const m = getM(form);
  const n = getN(form);
  const accountKey = getAccountKey(form);
  const tx = getTx(form);
  const data = getData(form);
  const script = data ? makeScript(data) : '';

  const dataMap = {
    createWallet: {
      id,
      passphrase,
      type: 'pubkeyhash',
    },
    getWalletInfo: {},
    getAddress: {},
    sendTx: {
      rate,
      passphrase,
      outputs: [{ value, address }],
    },
    createMultisig: {
      id,
      passphrase,
      type: 'multisig',
      m,
      n,
    },
    addKey: { accountKey },
    createTx: {
      rate,
      passphrase,
      outputs: [{
        value,
        address,
      }],
    },
    signTx: {
      passphrase,
      tx: tx ? MTX.fromOptions(tx) : '',
    },
    addData: {
      rate,
      passphrase,
      outputs: [{
        value: 0,
        script,
      }],
    },
  };

  return JSON.stringify(dataMap[action]);
};

export const reqType = () => ({
  createWallet: 'POST',
  getWallet: 'GET',
  sendTx: 'POST',
  getAddress: 'POST',
  createMultisig: 'POST',
  addKey: 'PUT',
  createTx: 'POST',
  signTx: 'POST',
  addData: 'POST',
});

export const checkInputs = (action, form) => {
  const walletId = form.find('input.wallet-id');
  const walletPassphrase = form.find('input.wallet-passphrase');

  // some simple form validation
  if ((action === 'createWallet' || action === 'sendTx')
      && (!walletId.val().length || !walletPassphrase.val().length)) {
    // create wallet and send transaction both need a passphrase
    alert('Provide an id and a passphrase');
    return false;
  } else if (action === 'getWallet' && !walletId.val().length) {
    // get wallet only needs wallet id
    alert('Provide an id');
    return false;
  }

  return true;
};
