import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Profile extends Component {
  constructor(){
    super();
    this.state={
      name: '',
      phone_number: '',
      exchange: '',

      selectedExchange: '',
    }
  }

  // 초기 화면에 현재 개인 정보 및 거래소 정보 표시
  componentDidMount() {
    // 앞단 테스트용 =============================================================================================================================
    // var response = {
    //   data: {"name":"테스트","phone_number":"01053265984","exchange":[{"exchange_name":"BINANCE","secret_key":"VsYgQmXENsOwBhVIMnrsvtuBWwn568t5AFRlFHO3bZd47WzXUFBxMRPrTN3TYNAH","api_key":"UMjZpOB0UNMMRRh697FgDiUb81vyKLlOey7fQeeBAM9MoOOoNgDAWB0PpjJNwvWe"},{"exchange_name":"BITHUMB","secret_key":"8f0d6ad5a93ca501061e73e18811bf3c","api_key":"68c761b96fb41cceb9366e145f6b161c"},{"exchange_name":"COINONE","secret_key":'',"api_key":''}]}
    // }
    // this.setState({
    //   name: response.data.name,
    //   phone_number: response.data.phone_number,
    //   exchange: response.data.exchange,
    // =========================================================================================================================================

    //   selectedExchange: response.data.exchange[0]
    // })
    axios.get('Profile')
    .then( response => {
      this.setState({
        name: response.data.name,
        phone_number: response.data.phone_number,
        exchange: response.data.exchange, // 거래소 정보 담긴 배열, 거래소 순서는 redux store에 저장된 거래소 배열의 순서와 같아야함
  
        selectedExchange: response.data.exchange[0]
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  handleExchange = () => {
    this.setState({
      selectedExchange: this.state.exchange[document.getElementById('exchange').selectedIndex]
    })
  }

  handleValue = (e, key) => {
    switch(key){
      case 'name':
        return this.setState({ name: e.target.value })
      case 'phone_number':
        if(!isNaN(e.target.value)) return this.setState({ phone_number: e.target.value })
        else return
      case 'api_key':
        return this.setState({ selectedExchange: { ...this.state.selectedExchange, api_key: e.target.value } })
      case 'secret_key':
        return this.setState({ selectedExchange:{ ...this.state.selectedExchange, secret_key: e.target.value } })
      default:
        return key
    }
  }

  handleModify = (e) => {
    if(window.confirm('수정하시겠습니까?')){
      // 수정된 내용 적용 후 정보 최신화
      e.target.id === 'modPersonal'
      ? axios.post( // 개인 정보 수정일 경우
          'Profile', 
          'profile='+true+
          '&name='+document.getElementById('name').value+
          '&phone_number='+document.getElementById('phone_number').value,
          { 'Content-Type': 'application/x-www-form-urlencoded' }
        )
        .then( response => {
          this.setState({
            name: response.data.name,
            phone_number: response.data.phone_number
          })
        }) 
        .catch( response => { console.log('err\n'+response); } ) // ERROR
      : axios.post( // 거래소 정보 수정일 경우
          'Profile', 
          'profile='+false+
          '&exchange_name='+document.getElementById('exchange').value+
          '&api_key='+document.getElementById('api_key').value+
          '&secret_key='+document.getElementById('secret_key').value,
          { 'Content-Type': 'application/x-www-form-urlencoded' }
        )
        .then( response => {
          this.setState({
            exchange: response.data.exchange,
      
            selectedExchange: response.data.exchange[document.getElementById('exchange').selectedIndex]
          })
        }) 
        .catch( response => { console.log('err\n'+response); } ) // ERROR
    }
  }

  handleComplete = () => {
    if(window.confirm('수정을 누르지 않은 정보는 저장되지 않습니다.')){
      window.location = "/";
    }
  }

  render() {
    const { exchangeList } = this.props
    const { selectedExchange } = this.state
    return (
      <div>
        <h4>개인 정보</h4>
        이름: <input id="name" value={this.state.name} onChange={(e)=>this.handleValue(e, 'name')}/><br/>
        휴대폰 번호: <input id="phone_number" value={this.state.phone_number} onChange={(e)=>this.handleValue(e, 'phone_number')}/><br/>
        <button id="modPersonal" onClick={this.handleModify}>수정</button>
        <h4>거래소 정보</h4>
        <select id="exchange" onChange={this.handleExchange}>
          {exchangeList.map((exchange, index) => {
            return (<option key={index} > {exchange.key} </option>)
          })
          }
        </select><br/>
        API KEY: <input id="api_key" value={selectedExchange.api_key} onChange={(e)=>this.handleValue(e, 'api_key')}/><br/>
        SECRET KEY: <input id="secret_key" value={selectedExchange.secret_key} onChange={(e)=>this.handleValue(e, 'secret_key')}/><br/>
        <button id="modExchange" onClick={this.handleModify}>수정</button><br/><br/><br/>
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

