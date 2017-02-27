/* eslint-disable */
`use strict`
$(function() {
  'use strict';
  const formActionButton = $('form button');
  const messageContainer = $('.server-messages');
  const apiKey = $('input[name="apiKey"]');

  $.get('/node/fee', (data) => {
    let value = data.rate;
    $('input[name="fee"]').val(value);
  });

  formActionButton.on('click', function(event) {
    event.preventDefault();
    const action = $(this).attr('data-action');

    const actionMap = {
      createWallet: {
        type: 'POST',
        url: '/node/wallet',
        reqFunc: addWallet,
      },
      getWallet: {
        type: 'GET',
        url: '/node/wallet',
        reqFunc: getWalletInfo,
      },
      sendTx: {
        type: 'POST',
        reqFunc: createTransaction,
      },
      getAddress: {
        type: 'POST',
        reqFunc: getAddress,
      },
      createMultisig: {
        type: 'POST',
        reqFunc: createMultisigWallet,
      },
      addKey: {
        type: 'PUT',
        reqFunc: addKey,
      },
      createTx: {
        type: 'POST',
        reqFunc: createTransaction,
      },
      signTx: {
        type: 'POST',
        reqFunc: signTransaction,
      },
    }

    const form = $(this).parent();
    const walletId = form.find('input.wallet-id').val();
    if (!checkInputs(action, form)) return;

    actionMap[action].reqFunc(form, action, walletId)
      .done(function(response){
        var prettyResponse = JSON.stringify(response,null,'\t');
        var message =
          '<h4>Server Response:</h4>'
          .concat('<pre class="server-message" style="width:75%;">')
          .concat(prettyResponse)
          .concat('</pre>');
        messageContainer.html(message);
      });
  });

  function checkInputs(action, form) {
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

  function addWallet(form) {
    const walletId = form.find('input.wallet-id');
    const walletPassphrase = form.find('input.wallet-passphrase');

    const data = {
      id: walletId.val(),
      passphrase: walletPassphrase.val(),
      type: "pubkeyhash",
    };

    return $.ajax({
      type: 'POST',
      url: '/node/wallet',
      data: JSON.stringify(data),
      processData: false,
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Basic " + btoa('' + ":" + apiKey.val()));
      },
      contentType: 'application/json'
    });
  };

  function getWalletInfo(form) {
    const walletId = form.find('input.wallet-id').val();

    return $.ajax({
      type: 'GET',
      url:'/node/wallet/'.concat(walletId),
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Basic " + btoa('' + ":" + apiKey.val()));
      },
      contentType: 'application/json',
    });
  };

  function getAddress(form) {
    const walletId = form.find('input.wallet-id').val();

    return $.ajax({
      type: 'POST',
      url: '/node/wallet/'.concat(walletId).concat('/address'),
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Basic " + btoa('' + ":" + apiKey.val()));
      },
      contentType: 'application/json',
    });
  }

  function createTransaction(form, action) {
    const walletId = form.find('input.wallet-id').val();
    const passphrase = form.find('input.wallet-passphrase').val();
    const rate = form.find('input[name="fee"]').val();
    const address = form.find('input[name="destination"]').val();
    const value = form.find('input[name="tx-amount"]').val();

    let endpoint;

    if (action === 'sendTx') {
      endpoint = '/send';
    } else if (action === 'createTx') {
      endpoint = '/create';
    } else {
      endpoint = '/';
    }

    const data = {
      rate,
      passphrase,
      outputs: [{
        value,
        address,
      }],
    };

    return $.ajax({
      type: 'POST',
      url: '/node/wallet/'.concat(walletId, endpoint),
      data: JSON.stringify(data),
      processData: false,
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Basic " + btoa('' + ":" + apiKey.val()));
      },
      contentType: 'application/json'
    });
  };


  function createMultisigWallet(form) {
    const walletId = form.find('input.wallet-id').val();
    const passphrase = form.find('input.wallet-passphrase').val();
    const m = form.find('input[name="m"]').val();
    const n = form.find('input[name="n"]').val();

    const data = {
      id: walletId,
      passphrase,
      type: "multisig",
      m,
      n,
    };

    return $.ajax({
      type: 'POST',
      url: '/node/wallet',
      data: JSON.stringify(data),
      processData: false,
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Basic " + btoa('' + ":" + apiKey.val()));
      },
      contentType: 'application/json'
    });
  };

  function addKey(form) {
    const walletId = form.find('input.wallet-id').val();
    const accountKey = form.find('input[name="accountKey"]').val();

    const data = {
      accountKey,
    };

    return $.ajax({
      type: 'PUT',
      url: '/node/wallet/'.concat(walletId).concat('/shared-key'),
      data: JSON.stringify(data),
      processData: false,
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Basic " + btoa('' + ":" + apiKey.val()));
      },
      contentType: 'application/json'
    });
  }

  function signTransaction(form, action, walletId) {
    const passphrase = form.find('input.wallet-passphrase').val();
    const tx = JSON.parse(form.find('textarea[name="tx"]').val());

    const data = {passphrase, tx};
    console.log('data: ', data);

    return $.ajax({
      type: 'POST',
      url: '/node/wallet/'.concat(walletId).concat('/sign'),
      data: JSON.stringify(data),
      processData: false,
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Basic " + btoa('' + ":" + apiKey.val()));
      },
      contentType: 'application/json'
    });
  }
});
