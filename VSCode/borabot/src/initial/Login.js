import React, { Component } from 'react';
import crypto from 'crypto';
import axios from 'axios';

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
    axios.post( 
      'Login', 
      'email='+this.state.email+'&password='+encrypt(this.state.password, key), 
      { 'Content-Type': 'application/x-www-form-urlencoded' }
     )
    
    // fetch('Login', {method: 'post'})
    // .then(res => res.json())
    // .then(
    //     (result) => {
    //         this.setState({
    //             listE: result
    //         })
    //     }
    // )

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

export default Login;

