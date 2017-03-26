import React, { PropTypes } from 'react';

const App = ({ children }) => (
  <div className="container" role="main">
    { children }
  </div>
);

App.propTypes = {
  children: PropTypes.node,
};

export default App;
