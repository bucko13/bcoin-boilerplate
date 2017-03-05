import { mtx as MTX, script as Script } from 'bcoin';

const getValFromForm = (form, type, name) => form.find(`${type}[name="${name}"]`).val();

const makeScript = (data) => {
  const opcodes = Script.opcodes;
  const script = new Script();
  script.push(opcodes.OP_RETURN);
  script.push(data);
  script.compile();

  return script.toJSON();
};

export const reqProps = (form) => {
  const id = getValFromForm(form, 'input', 'walletId');
  const passphrase = getValFromForm(form, 'input', 'passphrase');
  const value = getValFromForm(form, 'input', 'tx-amount');
  const rate = getValFromForm(form, 'input', 'fee');
  const destinationAddress = getValFromForm(form, 'input', 'destination');
  const tx = getValFromForm(form, 'textarea', 'tx');
  const data = getValFromForm(form, 'textarea', 'data');

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
        tx: tx ? MTX.fromOptions(tx) : '',
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
  };

  return propsMap;
};

export const checkInputs = (action, form) => {
  const idField = form.find('input[name="walletId"]');
  const passphraseField = form.find('input[name="passphrase"]');
  const id = getValFromForm(form, 'input', 'walletId');
  const passphrase = getValFromForm(form, 'input', 'passphrase');

  // some simple form validation
  if (idField.length && passphraseField.length) {
    if (!id.length || !passphrase.length) {
      alert('Provide an id and a passphrase'); // eslint-disable-line no-alert, no-undef
      return false;
    }
  } else if (idField.length && !id.length) {
    alert('Please provide a wallet id'); // eslint-disable-line no-alert, no-undef
    return false;
  }

  return true;
};
