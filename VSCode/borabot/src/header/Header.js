import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Header extends Component {

  HandleLogOut = () => {
    axios.get( 'Logout' )

    // fetch('Logout'              // 서버용
    // , {credentials: 'include'} // 서버용 
    // ) 

    window.location = "/";
  }

  render() {
    return (
        <div>
          <Link to="/main">Borabot</Link>============
          <Link to="/board">Board</Link>============
          <Link to="/backtesting">BackTesting</Link>============
          <Link to="/profile">Profile</Link>============
          <Link to="/">Init</Link>========================
          <button onClick={this.HandleLogOut}>로그아웃</button>
          
        {/* <form action="Logout" method="POST"><input type="submit" value="로그아웃"/></form> */}
        </div>
    );
  }
}

export default Header;

