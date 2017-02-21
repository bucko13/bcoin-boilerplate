/* eslint-disable */
$(function() {
  'use strict';
  var newWalletId = $('input.wallet-id');
  var newWalletPassphrase = $('input.wallet-passphrase'); 
  var submitWalletButton = $('button.new-wallet');
  var messageContainer = $('.server-messages');
  submitWalletButton.on('click', function(event) {
    event.preventDefault();
    if ( !newWalletId.val().length || !newWalletPassphrase.val().length) {
      alert('Provide an id and a passphrase');
      return;
    }

    var options = {
      id: newWalletId.val(),
      passphrase: newWalletPassphrase.val(),
      type: "pubkeyhash",
    };

    $.ajax({
      type: 'POST',
      url: '/node/wallet',
      data: JSON.stringify(options),
      processData: false,
      contentType: 'application/json'
    }).done(function(response){
      var message = '<span>Response from the server:'.concat(JSON.stringify(response)).concat('</span>');
      messageContainer.html(message);
      setTimeout(function() {
        messageContainer.html('');
      }, 3500);
    });
  });
});
