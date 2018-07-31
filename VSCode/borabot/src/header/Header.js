import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

import { logout } from '../reducers/logInOut';

class Header extends Component {
  HandleLogOut = () => {
    if(window.confirm('로그아웃하시겠습니까?')){
      axios.get( 'Logout')
      this.props.onLogout()
      alert('로그아웃되었습니다..')
    }
  }

  render() {
    return (
      <div>
        <Link to="/">Borabot</Link>============
        <Link to="/board">Board</Link>============
        <Link to="/backtesting">BackTesting</Link>============
        <Link to="/strategy">Strategy</Link>============
        <Link to="/log">Log</Link>============
        <Link to="/profile">Profile</Link>============
        {this.props.login && <button onClick={this.HandleLogOut}>로그아웃</button>}
      </div>
    );
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(logout())
  }
}

let mapStateToProps = (state) => {
  return {
    login: state.logInOut.login
  };
}

Header = connect(mapStateToProps, mapDispatchToProps)(Header);

export default Header;