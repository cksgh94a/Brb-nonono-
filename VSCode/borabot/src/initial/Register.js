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
    this.setState({
      password: encrypt(this.state.password, key)
    })

    var param = {
      a: 1,
      b: 2
    }
    axios({
          method: 'post',
          url: 'Register',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: param
        })

    // var bodyFormData = new FormData();
    // bodyFormData.set('email', 'Fred');
    // axios({
    //   method: 'post',
    //   url: 'Register',
    //   data: bodyFormData,
    //   config: { headers: {'Content-Type': 'application/x-www-form-urlencoded' }}
    //   })

    // axios.post('/Register', {
    //     'email': this.state.email,
    //     'password':this.state.email
    // })
  
  
    // var json = new Object();
    // json.email = this.state.email;
    // json.password = this.state.password;

    // fetch('Register', {
    //   credentials: 'include',
    //   method: 'post',
    //   body: JSON.stringify(json)
    // })
  }

  render() {
    return (
      <div>
        {/* <form action="Register" method="POST">회원가입<br/> 
          <input type="text" placeholder="email" name="email" onChange={(e)=>this.handleChange(e)}/><br/>
          <input type="password" placeholder="비밀번호" name="password"onChange={(e)=>this.handleChange(e)} value={this.state.password}/><br/>
          <input disabled={this.state.isVal} type="submit" value="회원가입" onClick={this.handleRegister}/>
        </form> */}

          <input type="text" placeholder="email" name="email" onChange={(e)=>this.handleChange(e)}/><br/>
          <input type="password" placeholder="비밀번호" name="password"onChange={(e)=>this.handleChange(e)}/><br/>
          <button disabled={this.state.isVal} onClick={this.handleRegister}>회원가입</button>      
      </div>      
    );
  }
}

export default Register;

