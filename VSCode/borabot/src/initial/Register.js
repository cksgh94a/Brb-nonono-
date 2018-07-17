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

class Register extends Component {
  constructor(props) {
    super(props);
    this.state={
      email: null,
      password: null,
      isVal: true
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

  handleRegister = (e) => {

    axios.post( 
      'Register', 
      'email='+this.state.email+'&password='+encrypt(this.state.password, key), 
      { 'Content-Type': 'application/x-www-form-urlencoded' }
     )
     
     window.location = "/";
  }

  render() {
    return (
      <div>
          <input type="text" placeholder="email" name="email" onChange={(e)=>this.handleChange(e)}/><br/>
          <input type="password" placeholder="비밀번호" name="password"onChange={(e)=>this.handleChange(e)}/><br/>
          <button disabled={this.state.isVal} onClick={this.handleRegister}>회원가입</button>      
      </div>      
    );
  }
}

export default Register;

