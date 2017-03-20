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

render(
  <App>
    <NavBar appName="Bcoin Boilerplate" />
    { forms.map(makeFormItems) }
  </App>,
  document.getElementById('app'),
);
