import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Login from './Login';

class Initial extends Component {

  render() {
    return (
        <div>
            <Login/><br/><br/>
            회원이 아니십니까?
            <Link to="/register">회원가입</Link>
        </div>
    );
  }
}

export default Initial;