import React, { Component } from 'react';

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
    
    if(this.state.email != null && this.state.password !=null){
      this.setState({
        isVal: false
      })
    }
    console.log(this.state.email)
    console.log(this.state.password)
  }

  handleRegister = (e) => {
    const formData = new FormData();
    formData.append(email,this.state.email);
    formData.append(password,this.state.password);
    fetch('http://localhost:8080/BORABOT/Register', {method: 'POST', body: formData})
  }

  render() {
    return (
      <div>
        회원가입<br/>
        <input type="text" placeholder="email" onChange={(e)=>this.handleChange(e)}/><br/>
        <input type="password" placeholder="비밀번호" onChange={(e)=>this.handleChange(e)}/><br/>
        <button disabled={this.state.isVal} onClick={this.handleRegister} >회원가입</button>
        {/* <form action="http://localhost:8080/BORABOT/Auth" method="POST">회원가입<br/> 
            <input type="text" placeholder="email" name="email"/><br/>
            <input type="password" placeholder="비밀번호" name="password"/><br/>
            <input type="submit" value="회원가입"/>
        </form><br/> */}
      </div>      
    );
  }
}

export default Register;

