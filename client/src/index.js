import $ from 'jquery';
import { reqUrl, reqData, reqType, checkInputs } from './utils';

$(() => {
  const formActionButton = $('form button');
  const messageContainer = $('.server-messages');
  const apiKey = $('input[name="apiKey"]');

  $.get('/node/fee', (data) => {
    const value = data.rate;
    $('input[name="fee"]').val(value);
  });

  formActionButton.on('click', function submitClick(event) {
    event.preventDefault();

    const action = $(this).attr('data-action');
    const form = $(this).parent();

    if (!checkInputs(action, form)) return;

    const type = reqType()[action];
    const url = reqUrl(form, action);
    const data = reqData(form, action);

    $.ajax({
      type,
      url,
      data,
      processData: false,
      beforeSend: (xhr) => {
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa('' + ':' + apiKey.val()));
      },
      contentType: 'application/json',
    }).done((response) => {
      const prettyResponse = JSON.stringify(response, null,'\t');
      const message =
        '<h4>Server Response:</h4>'
        .concat('<pre class="server-message" style="width:75%;">')
        .concat(prettyResponse)
        .concat('</pre>');
      messageContainer.html(message);
    });
  });
});
