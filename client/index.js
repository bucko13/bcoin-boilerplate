/* eslint-disable */
`use strict`
$(function() {
  'use strict';
  var formActionButton = $('form button');
  var messageContainer = $('.server-messages');
  var apiKey = $('input[name="apiKey"]');

  $.get('/node/fee', (data) => {
    let value = data.rate;
    $('input[name="fee"]').val(value);
  });

  formActionButton.on('click', function(event) {
    event.preventDefault();
    var action = $(this).attr('data-action');

    var actionMap = {
      create: {
        type: 'POST',
        url: '/node/wallet',
        reqFunc: addWallet,
      },
      get: {
        type: 'GET',
        url: '/node/wallet',
        reqFunc: getWalletInfo,
      },
      sendTx: {
        type: 'POST',
        reqFunc: sendTransaction,
      },
    }

    var form = $(this).parent();

    if (!checkInputs(action, form)) return;

    actionMap[action].reqFunc(form, action)
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
    var walletId = form.find('input.wallet-id');
    var walletPassphrase = form.find('input.wallet-passphrase');

    if ((action === 'create' || action === 'sendTx')
        && (!walletId.val().length || !walletPassphrase.val().length)) {
      alert('Provide an id and a passphrase');
      return false;
    } else if (action === 'get' && !walletId.val().length) {
      alert('Provide an id');
      return false;
    }

    return true;
  };

  function addWallet(form) {
    var walletId = form.find('input.wallet-id');
    var walletPassphrase = form.find('input.wallet-passphrase');

    var options = {
      id: walletId.val(),
      passphrase: walletPassphrase.val(),
      type: "pubkeyhash",
    };

    return $.ajax({
      type: 'POST',
      url: '/node/wallet',
      data: JSON.stringify(options),
      processData: false,
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Basic " + btoa('' + ":" + apiKey.val()));
      },
      contentType: 'application/json'
    });
  };

  function getWalletInfo(form) {
    var walletId = form.find('input.wallet-id').val();

    return $.ajax({
      type: 'GET',
      url:'/node/wallet/'.concat(walletId),
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Basic " + btoa('' + ":" + apiKey.val()));
      },
      contentType: 'application/json',
    });
  };

  function sendTransaction(form) {
    const walletId = form.find('input.wallet-id').val();
    const passphrase = form.find('input.wallet-passphrase').val();
    const rate = form.find('input[name="fee"]').val();
    const address = form.find('input[name="destination"]').val();
    const value = form.find('input[name="tx-amount"]').val();

    const options = {
      rate,
      passphrase,
      outputs: [{
        value,
        address,
      }],
    };

    return $.ajax({
      type: 'POST',
      url: '/node/wallet/'.concat(walletId).concat('/send'),
      data: JSON.stringify(options),
      processData: false,
      beforeSend: function (xhr) {
          xhr.setRequestHeader ("Authorization", "Basic " + btoa('' + ":" + apiKey.val()));
      },
      contentType: 'application/json'
    });
  };
});
