import React, { Component } from 'react';
import axios from 'axios';

class Profile extends Component {
  constructor(){
    super();
    this.state={
      personal:{
        name:'',
        phoneNumber:''
      },
      bitthumb:{
        APIKEY:'',
        secretKEY:''
      },
      bittrex:{
        APIKEY:'',
        secretKEY:''
      },
      coinone:{
        APIKEY:'',
        secretKEY:''
      },
      binance:{
        APIKEY:'',
        secretKEY:''
      }
    }
  }

  // 초기 화면에 현재 개인 정보 및 거래소 정보 표시
  componentDidMount() {
    axios.get('Profile')
    .then( response => {
      this.setState({
        personal:{
          name: '',
          phoneNumber: ''
        },
        bitthumb:{
          APIKEY:'',
          secretKEY:''
        },
        bittrex:{
          APIKEY:'',
          secretKEY:''
        },
        coinone:{
          APIKEY:'',
          secretKEY:''
        },
        binance:{
          APIKEY:'',
          secretKEY:''
        }
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  handlePersonal = () => {    
    axios.post( 
      'Profile', 
      'name='+document.getElementById('name').value+
      '&phoneNumber='+document.getElementById('phoneNumber').value,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
  }

  handleExchage = () => {    
    axios.post( 
      'Profile', 
      'exchange='+document.getElementById('exchange').value+
      '&APIKEY='+document.getElementById('APIKEY').value+
      '&secretKEY='+document.getElementById('secretKEY').value,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
  }

  render() {
    return (
      <div>
        <h4>개인 정보</h4>
        <input placeholder="이름" id="name"/><br/>
        <input placeholder="전화번호" id="phoneNumber"/><br/>
        <button onClick={this.handlePersonal}>수정</button>
        <h4>거래소 정보</h4>
        <select id="exchange">
          <option>bitthumb</option>
          <option>bittrex</option>
          <option>coinone</option>
          <option>binance</option>
        </select><br/>
        <input placeholder="API Key" id="APIKEY"/><br/>
        <input placeholder="Secret Key" id="secretKEY"/><br/>
        <button onClick={this.handleExchage}>수정</button>
      </div>
    );
  }
}

export default Profile;

