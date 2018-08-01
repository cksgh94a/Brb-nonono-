import React, { Component } from 'react';
import crypto from 'crypto';
import axios from 'axios';
import { connect } from 'react-redux';

import { login } from '../reducers/logInOut';

var key = "tHis_iS_pRivaTe_Key";
const encrypt = (err, key) => {
  let cipher = crypto.createCipher('aes-256-cbc', key);
  let encipheredpw = cipher.update(err, 'utf-8', 'hex');
  // encipheredpw = cipher.setAutoPadding(auto_padding=true);
  encipheredpw += cipher.final('hex');
  return encipheredpw;
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state={
      email: null,
      password: null
    }
  }

  handleChange = (e) => {  
    if(e.target.placeholder === "email"){
      this.setState({
        email: e.target.value
      })
    }
    else{
      this.setState({
        password: e.target.value
      })
    }
    
    // 회원가입 조건 검증
    if(this.state.email != null && this.state.password !=null){
      this.setState({
        isVal: false
      })
    }
  }

  handleLogin = (e) => {

    // this.props.onLogin() // 앞단 테스트용 로그인 통과

    axios.post( 
      'Login', 
      'email='+this.state.email+'&password='+encrypt(this.state.password, key), 
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
    .then( response => {
      if(response.data === 'emailError') alert('존재하지 않는 계정입니다.')
      else if(response.data === 'pwError') alert('비밀번호가 일치하지 않습니다.')
      else if(response.data === 'complete') {
        this.props.onLogin()
        window.location = "/";
      } 
      else alert(response.data)
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR

  }

  render() {
    return (
      <div>
        <input type="text" placeholder="email" name="email" onChange={(e)=>this.handleChange(e)}/><br/>
        <input type="password" placeholder="비밀번호" name="password" onChange={(e)=>this.handleChange(e)}/><br/>
        <button onClick={this.handleLogin}>로그인</button>      
      </div>      
    );
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    onLogin: () => dispatch(login())
  }
}

Login = connect(undefined, mapDispatchToProps)(Login);

export default Login;

