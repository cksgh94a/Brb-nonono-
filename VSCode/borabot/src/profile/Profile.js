import React, { Component } from 'react';
import axios from 'axios';

var bitthumb = {
  api_key : '',
  secret_key : ''
}
var bittrex = {
  api_key : '',
  secret_key : ''
}
var coinone = {
  api_key : '',
  secret_key : ''
}
var binance = {
  api_key : '',
  secret_key : ''
}

class Profile extends Component {
  constructor(){
    super();
    this.state={
      name: '',
      phone_number: '',
      api_key: '',
      secret_key: ''
    }
  }

  // 초기 화면에 현재 개인 정보 및 거래소 정보 표시
  componentDidMount() {
    axios.get('Profile')
    .then( response => {
      this.setState({
        name: response.data.name,
        phone_number: response.data.phone_number,
        api_key: response.data.bitthumb.api_key,
        secret_key: response.data.bitthumb.secret_key
      })
      bitthumb = {
        api_key: response.data.bitthumb.api_key,
        secret_key: response.data.bitthumb.secret_key
      },
      bittrex = {
        api_key: response.data.bittrex.api_key,
        secret_key: response.data.bittrex.secret_key
      },
      coinone = {
        api_key: response.data.coinone.api_key,
        secret_key: response.data.coinone.secret_key
      },
      binance = {
        api_key: response.data.binance.api_key,
        secret_key: response.data.binance.secret_key
      }
      console.log(response.data)
      console.log(response.data.name)
      console.log(bitthumb)
      console.log(coinone)
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  handleChange = (e) => {
    if(e.target.value === 'bitthumb'){
      this.setState({
        api_key: bitthumb.api_key,
        secret_key: bitthumb.secret_key
      })      
    }
    else if(e.target.value === 'bittrex'){
      this.setState({
        api_key: bittrex.api_key,
        secret_key: bittrex.secret_key
      })      
    }
    else if(e.target.value === 'coinone'){
      this.setState({
        api_key: coinone.api_key,
        secret_key: coinone.secret_key
      })      
    }
    else {
      this.setState({
        api_key: binance.api_key,
        secret_key: binance.secret_key
      })      
    }
  }

  handlePersonal = () => {    
    axios.post( 
      'Profile', 
      'profile='+true+
      '&name='+document.getElementById('name').value+
      '&phone_number='+document.getElementById('phone_number').value,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
  }

  handleExchage = () => {    
    axios.post( 
      'Profile', 
      'profile='+false+
      '&exchange_name='+document.getElementById('exchange_name').value+
      '&api_key='+document.getElementById('api_key').value+
      '&secret_key='+document.getElementById('secret_key').value,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
  }

  handleComplete = () => {
    alert('수정을 누르지 않은 정보는 저장되지 않습니다.')
    window.location = "/main";
  }

  render() {
    return (
      <div>
        <h4>개인 정보</h4>
        <input placeholder={"이름: "+this.state.name} id="name"/><br/>
        <input placeholder={"전화번호: "+this.state.phone_number} id="phone_number"/><br/>
        <button onClick={this.handlePersonal}>수정</button>
        <h4>거래소 정보</h4>
        <select id="exchange_name" onChange={(e)=>this.handleChange(e)}>
          <option>bitthumb</option>
          <option>bittrex</option>
          <option>coinone</option>
          <option>binance</option>
        </select><br/>
        <input placeholder={"API Key: "+this.state.api_key} id="api_key"/><br/>
        <input placeholder={"Secret Key: "+this.state.secret_key} id="secret_key"/><br/>
        <button onClick={this.handleExchage}>수정</button><br/><br/><br/>
        <button onClick={this.handleComplete}>완료</button>
      </div>
    );
  }
}

export default Profile;

