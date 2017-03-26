import $ from 'jquery';
import { reqProps, checkInputs } from '../utils/utils';
import { writeLink } from '../../slim-bcoin/baycoin/baycoin'

export default function submitClick() {
  //event.preventDefault();
  //event.stopPropagation();

  //console.log(arguments);
  const messageContainer = $('.server-messages');
  const apiKey = $('input[name="apiKey"]');
  const nodeEndpoint = '/node';

  //const action = $(this).attr('data-action');
  //const form = $(this).parent().get(0);

  //if (!checkInputs(action, form)) return;

  //const reqPropsMap = reqProps(form)[action];
  //console.log('reqPropsMap: ',reqPropsMap);
  const type = 'POST';
  const url = '/submitBatch'; //nodeEndpoint.concat(reqPropsMap.url);
  const dataLength = window.batchData.names.length;
  const data = JSON.stringify({names: window.batchData.names, datas: window.batchData.datas }); //reqPropsMap.data ? JSON.stringify(reqPropsMap.data) : '';
  //console.log(dataLength);
  
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
    const pasteUrl = prettyResponse.trim();
    
    writeLink(pasteUrl).then(hash => {
      const message =
      `<h4>Success!</h4>`
      //.concat('<pre class="server-message">')
      .concat(`<div>${dataLength} magnetlinks saved to`)
      .concat(`${pasteUrl}.<br />Link added to ${hash}</div>`);
      //.concat('</pre>');
    messageContainer.html(message);
    });

    
  });
}
