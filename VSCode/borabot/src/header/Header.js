import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Header extends Component {

  HandleLogOut = () => {
    if(window.confirm('로그아웃하시겠습니까?')){
      axios.get( 'Logout')
      window.location = "/";
      alert('로그아웃되었습니다..')
    }
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