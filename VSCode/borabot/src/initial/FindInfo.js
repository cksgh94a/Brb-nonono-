import React, { Component } from 'react';
import axios from 'axios';

class FindInfo extends Component {
  constructor(props) {
    super(props);
    this.state={
      email: null
    }
  }

  handleChange = (e) => {  
    if(e.target.placeholder === "email")
      this.setState({ email: e.target.value })
  }

  hadnleTempPwd = () => {
    this.state.email !== null
      && axios.post( 
          'FindInfo', 
          'email='+this.state.email, 
          { 'Content-Type': 'application/x-www-form-urlencoded' }
        )
        .then( response => {
          if(response.data === 'emailError') alert('존재하지 않는 계정입니다.')
          else if(response.data === 'complete') {
            alert('이메일 확인 후 비밀번호를 재설정해주세요.')
            window.location = "/";
          } 
          else alert(response.data)
        }) 
        .catch( response => { console.log('err\n'+response); } ) // ERROR
  }
  
  render() {
    return (
      <div>
        <input type="text" placeholder="email" name="email" onChange={(e)=>this.handleChange(e)}/><br/>
        <button onClick={this.hadnleTempPwd}>임시 비밀번호 발송</button>
      </div>      
    );
  }
}

export default FindInfo;

