import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Header extends Component {

  HandleLogOut = () => {
    axios.get( 'Logout')
    window.location = "/";
  }

  render() {
    return (
        <div>
          <Link to="/main">Borabot</Link>============
          <Link to="/board">Board</Link>============
          <Link to="/backtesting">BackTesting</Link>============
          <Link to="/strategy">Strategy</Link>============
          <Link to="/log">Log</Link>============
          <Link to="/profile">Profile</Link>============
          <button onClick={this.HandleLogOut}>로그아웃</button>
        </div>
    );
  }
}

export default Header;