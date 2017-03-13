import $ from 'jquery';
import submitAction from './submitAction';

$(() => {
  const formActionButton = $('form button');

  $.get('/node/fee', (data) => {
    const value = data.rate;
    $('input[name="fee"]').val(value);
  });

  formActionButton.on('click', submitAction);
});
