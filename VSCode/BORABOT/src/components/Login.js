import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  getAxios = () => {
    axios.get('http://localhost:8080/BORABOT/SendNowTrading').then(function(response){
        alert(response.data)
    });
  }

  render() {

    return (
      <div>
        <form action="DoAuth" method="POST">회원가입<br/> 
            Username: <input type="text" name="email"/><br /> Password:
            <input type="password" name="password"/><br /> <input
            type="submit" value="회원가입"/>
        </form><br/>
        <form action="http://localhost:8080/BORABOT/DoLogin" method="POST">Login<br/>
            Username: <input type="text" name="email"/><br /> Password:
            <input type="password" name="password"/><br /> <input
            type="submit" value="로그인"/>
        </form><br/>
        <button type="button" onClick={this.getAxios}>SNT TEST</button>
      </div>      
    );
  }
}

export default Login;

