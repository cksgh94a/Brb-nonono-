import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { login } from '../reducers/logInOut';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state={
      email: null,
      password: null
    }
  }

  handleAction = (a) => {
    a === 'r'
    ? this.props.handleAction('register')
    : this.props.handleAction('findInfo')
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

  handleLogin = () => {
    (this.state.email !== null && this.state.password !== null) ?    
      axios.post( 
        'LogInOut', 
        'email='+this.state.email+'&password='+this.state.password, 
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
      .catch( response => { console.log('err\n'+response); } ) : // ERROR
      alert('양식을 확인해주세요')
  }
  
  handleLoginT = () => {
    this.props.onLogin()
  }

  render() {
    return (
      <div>
        <input type="text" placeholder="email" name="email" onChange={(e)=>this.handleChange(e)}/><br/>
        <input type="password" placeholder="비밀번호" name="password" onChange={(e)=>this.handleChange(e)}/><br/>
        <button onClick={this.handleLogin}>로그인</button>
        <button onClick={this.handleLoginT}>테스트용</button><br/><br/>
        <button onClick={()=>this.handleAction('r')}>회원가입</button>
        <button onClick={()=>this.handleAction('f')}>비밀번호 찾기</button>
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

