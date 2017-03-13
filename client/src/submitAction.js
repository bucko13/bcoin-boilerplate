import $ from 'jquery';
import { reqProps, checkInputs } from './utils';

export default function submitClick(event) {
  event.preventDefault();

  const messageContainer = $('.server-messages');
  const apiKey = $('input[name="apiKey"]');
  const nodeEndpoint = '/node';

  const action = $(this).attr('data-action');
  const form = $(this).parent();

  if (!checkInputs(action, form)) return;

  const reqPropsMap = reqProps(form)[action];
  const type = reqPropsMap.type;
  const url = nodeEndpoint.concat(reqPropsMap.url);
  const data = reqPropsMap.data ? JSON.stringify(reqPropsMap.data) : '';

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
    const prettyResponse = JSON.stringify(response, null, '\t');
    const message =
      '<h4>Server Response:</h4>'
      .concat('<pre class="server-message" style="width:75%;">')
      .concat(prettyResponse)
      .concat('</pre>');
    messageContainer.html(message);
  });
}
