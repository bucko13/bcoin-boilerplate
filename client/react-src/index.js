import React from 'react';
import { render } from 'react-dom';

import App from './containers/App';
import NavBar from './components/NavBar';
import FormContainer from './containers/FormContainer';
import forms from './forms.json';

const makeFormItems = formProps => (
  <FormContainer
    title={formProps.title}
    actionName={formProps.actionName}
    formInputs={formProps.formInputs}
    formClass={formProps.formClass}
    key={formProps.actionName}
  />
);


const magnetLinks = [
  { torrentName: 'torrent1fed13f7749419551b9a24e15f8d3e6e67f83b097fed13f77494195', torrentMagnetLink: 'magnet:?dn=torrent1&xt=urn:btih:fed13f7749419551b9a24e15f8d3e6e67f83b097', torrentURL: 'http://releases.ubuntu.com/16.10/ubuntu-16.10-desktop-amd64.iso.torrent?_ga=1.184654186.239577515.1490491135' },
  { torrentName: 'torrent2', torrentMagnetLink: 'magnet:?dn=torrent2&xt=urn:btih:aed13f7749419551b9a24e15f8d3e6e67f83b096', torrentURL: 'http://releases.ubuntu.com/16.10/ubuntu-16.10-desktop-amd64.iso.torrent?_ga=1.184654186.239577515.1490491135' },
  { torrentName: 'torrent3', torrentMagnetLink: 'magnet:?dn=torrent3&xt=urn:btih:ded13f7749419551b9a24e15f8d3e6e67f83b095', torrentURL: 'http://releases.ubuntu.com/16.10/ubuntu-16.10-desktop-amd64.iso.torrent?_ga=1.184654186.239577515.1490491135' },
  { torrentName: 'torrent4', torrentMagnetLink: 'magnet:?dn=torrent4&xt=urn:btih:eed13f7749419551b9a24e15f8d3e6e67f83b093', torrentURL: 'http://releases.ubuntu.com/16.10/ubuntu-16.10-desktop-amd64.iso.torrent?_ga=1.184654186.239577515.1490491135' },
  { torrentName: 'torrent5', torrentMagnetLink: 'magnet:?dn=torrent5&xt=urn:btih:bed13f7749419551b9a24e15f8d3e6e67f83b094', torrentURL: 'http://releases.ubuntu.com/16.10/ubuntu-16.10-desktop-amd64.iso.torrent?_ga=1.184654186.239577515.1490491135' },
];

const listItems = magnetLinks.map(magnetLink =>
  <tr>
    <td>{magnetLink.torrentName}</td>
    <td><a href={magnetLink.torrentURL}><img alt="magnet-image" src="http://cf2.vuze.com/img/magnetic-link-2.png" width="20" height="20" /></a></td>
  </tr>,
);

render(
  <App>
    <NavBar appName="Boilerplate Bay" />
    { forms.map(makeFormItems) }
    <div className="">
      <h3>Search Results</h3>
      <table className="table table-striped">
        <tr>
          <th>Torrent Name</th>
          <th>Magnet File Link</th>
        </tr>
        {listItems}
      </table>
    </div>
  </App>,
  document.getElementById('app'),
);
