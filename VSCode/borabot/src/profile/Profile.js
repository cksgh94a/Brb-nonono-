import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

// var bitthumb = {
//   api_key : '',
//   secret_key : ''
// }
// var bittrex = {
//   api_key : '',
//   secret_key : ''
// }
// var coinone = {
//   api_key : '',
//   secret_key : ''
// }
// var binance = {
//   api_key : '',
//   secret_key : ''
// }

class Profile extends Component {
  constructor(){
    super();
    this.state={
      name: '',
      phone_number: '',
      api_key: '',
      secret_key: '',

      exchangeKey:'',
      selectedExchange: ''
    }
  }

  // 초기 화면에 현재 개인 정보 및 거래소 정보 표시
  componentDidMount() {
    var response = {
      data: {"name":"테스트","exchangeKey":{"COINONE":{"secret_key":null,"api_key":null},"BINANCE":{"secret_key":"VsYgQmXENsOwBhVIMnrsvtuBWwn568t5AFRlFHO3bZd47WzXUFBxMRPrTN3TYNAH","api_key":"UMjZpOB0UNMMRRh697FgDiUb81vyKLlOey7fQeeBAM9MoOOoNgDAWB0PpjJNwvWe"},"BITHUMB":{"secret_key":"8f0d6ad5a93ca501061e73e18811bf3c","api_key":"68c761b96fb41cceb9366e145f6b161c"}},"phone_number":"01053265984"}
    }
    this.setState({
      name: response.data.name,
      phone_number: response.data.phone_number,
      exchangeKey: response.data.exchangeKey,
      selectedExchange: response.data.exchangeKey
    })
    // bitthumb = {
    //   api_key: response.data.bitthumb.api_key,
    //   secret_key: response.data.bitthumb.secret_key
    // },
    // bittrex = {
    //   api_key: response.data.bittrex.api_key,
    //   secret_key: response.data.bittrex.secret_key
    // },
    // coinone = {
    //   api_key: response.data.coinone.api_key,
    //   secret_key: response.data.coinone.secret_key
    // },
    // binance = {
    //   api_key: response.data.binance.api_key,
    //   secret_key: response.data.binance.secret_key
    // }

    axios.get('Profile')
    .then( response => {
      this.setState({
        name: response.data.name,
        phone_number: response.data.phone_number,
        exchangeKey: response.data.exchangeKey,
        selectedExchange: ''
      })
      // bitthumb = {
      //   api_key: response.data.bitthumb.api_key,
      //   secret_key: response.data.bitthumb.secret_key
      // },
      // bittrex = {
      //   api_key: response.data.bittrex.api_key,
      //   secret_key: response.data.bittrex.secret_key
      // },
      // coinone = {
      //   api_key: response.data.coinone.api_key,
      //   secret_key: response.data.coinone.secret_key
      // },
      // binance = {
      //   api_key: response.data.binance.api_key,
      //   secret_key: response.data.binance.secret_key
      // }
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  // handleModify = (e) => {
  //   e.target.id === 'modPersonal'
  //   ? axios.post( 
  //       'Profile', 
  //       'profile='+true+
  //       '&name='+document.getElementById('name').value+
  //       '&phone_number='+document.getElementById('phone_number').value,
  //       { 'Content-Type': 'application/x-www-form-urlencoded' }
  //     )
  //   : axios.post( 
  //       'Profile', 
  //       'profile='+false+
  //       '&exchange_name='+document.getElementById('exchange_name').value+
  //       '&api_key='+document.getElementById('api_key').value+
  //       '&secret_key='+document.getElementById('secret_key').value,
  //       { 'Content-Type': 'application/x-www-form-urlencoded' }
  //     )
  // }

  // handleChange = (e) => {
  //   if(e.target.value === 'bitthumb'){
  //     this.setState({
  //       api_key: bitthumb.api_key,
  //       secret_key: bitthumb.secret_key
  //     })      
  //   }
  //   else if(e.target.value === 'bittrex'){
  //     this.setState({
  //       api_key: bittrex.api_key,
  //       secret_key: bittrex.secret_key
  //     })      
  //   }
  //   else if(e.target.value === 'coinone'){
  //     this.setState({
  //       api_key: coinone.api_key,
  //       secret_key: coinone.secret_key
  //     })      
  //   }
  //   else {
  //     this.setState({
  //       api_key: binance.api_key,
  //       secret_key: binance.secret_key
  //     })      
  //   }
  // }

  // handleExchage = () => {    
  // }

  // handleComplete = () => {
  //   alert('수정을 누르지 않은 정보는 저장되지 않습니다.')
  //   window.location = "/main";
  // }

  render() {
    const { exchangeList } = this.props
    const { exchangeKey } = this.state
    return (
      <div>
        <h4>개인 정보</h4>
        <input id="name" value={this.state.name}/><br/>
        <input id="phone_number" value={this.state.phone_number}/><br/>
        <button id="modPersonal" onClick={this.handleModify}>수정</button>
        <h4>거래소 정보</h4>
        <select id="exchange" onChange={this.handleExchange}>
          {exchangeList.map((exchange, index) => {
            return (<option key={index} > {exchange.key} </option>)
          })
          }
        </select><br/>
        <input id="api_key" value={this.state.api_key}/><br/>
        <input id="secret_key" value={this.state.secret_key}/><br/>
        <button id="modPersonal" onClick={this.handleModify}>수정</button><br/><br/><br/>
        <button onClick={this.handleComplete}>완료</button>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    exchangeList: state.exchange.exchangeList,
  };
}

Profile = connect(mapStateToProps)(Profile);

export default Profile;

