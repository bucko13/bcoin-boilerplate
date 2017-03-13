import $ from 'jquery';
import submitAction from './submitAction';

const indexTemplate = require('../templates/template.html');

$(() => {
  const formActionButton = $('form button');
  $('.app').html(indexTemplate);
  $.get('/node/fee', (data) => {
    const value = data.rate;
    $('input[name="fee"]').val(value);
  });

  formActionButton.on('click', submitAction);
});
