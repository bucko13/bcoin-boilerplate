import React, { PropTypes } from 'react';

const NavBar = ({ appName }) => (
  <nav className="navbar navbar-inverse">
    <div className="container">
      <div className="navbar-header">
        <a className="navbar-brand" href="#">{ appName }</a>
      </div>
    </div>
  </nav>
);

NavBar.propTypes = {
  appName: PropTypes.string,
};

export default NavBar;
