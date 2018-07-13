import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {

  render() {
    return (
        <div>
          <Link to="/main">Borabot</Link>
          <Link to="/board">Board</Link>
          <Link to="/backtesting">BackTesting</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/">Init</Link>
        </div>
    );
  }
}

export default Header;

