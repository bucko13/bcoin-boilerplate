import React from 'react';
import { render } from 'react-dom';

import App from './containers/App';
import NavBar from './components/NavBar';
import FormItem from './components/FormItem';

render(
  <App>
    <NavBar appName="Bcoin BoilerPlate" />
    <FormItem
      label="Wallet Id"
      name="walletId"
      type="input"
    />
  </App>,
  document.getElementById('app'),
);
