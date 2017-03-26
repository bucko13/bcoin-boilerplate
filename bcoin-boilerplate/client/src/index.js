import $ from 'jquery';
import submitAction from './submitAction';
/* globals
  window
*/

// export for others scripts to use
window.$ = $;
window.jQuery = $;

$(() => {
  const indexTemplate = require('./template.html');
  $('#app').html(indexTemplate);
  const formActionButton = $('form button');
  $.get('/node/fee', (data) => {
    const value = data.rate;
    $('input[name="fee"]').val(value);
  });

  formActionButton.on('click', submitAction);
});
