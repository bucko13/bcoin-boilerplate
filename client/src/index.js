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

  searchLink('').then(magnetObjs => {
    $('#loading').remove();
    magnetObjs = magnetObjs.slice(0,7);
    magnetObjs.forEach(magnetObj => {
      console.log('MagnetObj',magnetObj);
      let { name, link } = magnetObj;
      link = link.trim();
      name = 'tempName_chng_plz';
      while(link.includes('"')){
        link = link.replace('"','');
      }
      while(name.includes('"')){
        name = name.replace('"','');
      }
      $('#table').append($(`<tr><td>${name}</td><td><a href="${link}">Download</a></td></tr>`))
    });
  });
  $('#app').html(indexTemplate);
  //const formActionButton = $('form button');
  

  $.get('/node/fee', (data) => {
    const value = data.rate;
    $('input[name="fee"]').val(value);
  });

  //formActionButton.on('click', submitAction);
});