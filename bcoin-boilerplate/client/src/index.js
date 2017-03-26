import $ from 'jquery';
import submitAction from './submitAction';

import { makeScript }from '../utils/makeScript';
import { writeLink, searchLink } from '../../slim-bcoin/baycoin/baycoin';
/* globals
  window
*/
function addToBatch(){
    let name = $('#torrentname').val();
    let data = $('#data').val();
    while(name.includes("'")) {
      name = name.replace("'",'');
    }
    while(data.includes("'")) {
      data = data.replace("'",'');
    }
    window.batchData.names.push(name);
    window.batchData.datas.push(data);
    console.log(batchData.names.length,batchData.datas.length);
    $('#torrentname').val('');
    $('#data').val('');
  }

// export for others scripts to use
window.$ = $;
window.jQuery = $;
window.batchData = { names: [], datas: []};
window.addToBatch = addToBatch;
window.submitAction = submitAction;

$(() => {
  const indexTemplate = require('./template.html');

  $('#app').html(indexTemplate);
  //const formActionButton = $('form button');
  

  $.get('/node/fee', (data) => {
    const value = data.rate;
    $('input[name="fee"]').val(value);
  });

  //formActionButton.on('click', submitAction);
});