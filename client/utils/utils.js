import { mtx as MTX, script as Script } from 'bcoin';

const getValFromForm = (form, name, type = 'input') => {
  const el = form.querySelector(`${type}[name="${name}"]`);
  return el ? el.value : undefined;
};

const makeScript = (data) => {
  const opcodes = Script.opcodes;
  const script = new Script();
  script.push(opcodes.OP_RETURN);
  script.push(data);
  script.compile();

  return script.toJSON();
};

export const reqProps = (form) => {
  const id = getValFromForm(form, 'walletId');
  const passphrase = getValFromForm(form, 'passphrase');
  const value = getValFromForm(form, 'tx-amount');
  const rate = getValFromForm(form, 'fee');
  const destinationAddress = getValFromForm(form, 'destination');
  let tx = getValFromForm(form, 'tx', 'textarea');
  if (tx) {
    tx = JSON.parse(tx);
  }
  const data = getValFromForm(form, 'data', 'textarea');
  const hash = getValFromForm(form, 'hash');

  const propsMap = {
    getFee: { type: 'GET', url: '/fee' },
    createWallet: {
      type: 'POST',
      url: '/wallet',
      data: { id, passphrase, type: 'pubkeyhash' },
    },
    getWallet: { type: 'GET', url: `/wallet/${id}` },
    getAddress: { type: 'POST', url: `/wallet/${id}/address` },
    sendTx: {
      type: 'POST',
      url: `/wallet/${id}/send`,
      data: {
        rate,
        passphrase,
        outputs: [{ value, address: destinationAddress }],
      },
    },
    createMultisig: {
      type: 'POST',
      url: '/wallet',
      data: {
        id,
        passphrase,
        type: 'multisig',
        m: getValFromForm(form, 'input', 'm'),
        n: getValFromForm(form, 'input', 'n'),
      },
    },
    addKey: {
      type: 'PUT',
      url: `/wallet/${id}/shared-key`,
      data: {
        accountKey: getValFromForm(form, 'input', 'accountKey'),
      },
    },
    createTx: {
      type: 'POST',
      url: `/wallet/${id}/create`,
      data: {
        rate,
        passphrase,
        outputs: [{ value, address: destinationAddress }],
      },
    },
    signTx: {
      type: 'POST',
      url: `/wallet/${id}/sign`,
      data: {
        passphrase,
        tx: tx ? MTX.MTX.fromOptions(tx) : '',
      },
    },
    addData: {
      type: 'POST',
      url: `/wallet/${id}/send`,
      data: {
        rate,
        passphrase,
        outputs: [{
          value: 0,
          script: data ? makeScript(data) : '',
        }],
      },
    },
    getData: { type: 'GET', url: `/tx/${hash}` },
  };

  return propsMap;
};

export const checkInputs = (action, form) => {
  const idField = form.querySelector('input[name="walletId"]');
  const passphraseField = form.querySelector('input[name="passphrase"]');
  const id = getValFromForm(form, 'walletId');
  const passphrase = getValFromForm(form, 'passphrase');

  // some simple form validation
  if (!!idField && !!passphraseField) {
    if (!id.length || !passphrase.length) {
      alert('Provide an id and a passphrase'); // eslint-disable-line no-alert, no-undef
      return false;
    }
  } else if (!!idField && !id.length) {
    alert('Please provide a wallet id'); // eslint-disable-line no-alert, no-undef
    return false;
  }

  return true;
};
