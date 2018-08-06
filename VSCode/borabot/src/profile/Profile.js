import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Profile extends Component {
  constructor(){
    super();
    this.state={
      name: '', // 사용자 이름
      phone_number: '', // 사용자 전화번호
      password: null, // 비밀번호
      passwordC: null,  // 비밀번호 확인
      exchange: [], // 거래소 정보 리스트

      selectedExchange: '', // 선택된 거래소 정보

      pVal: false, // 비밀번호 유효성
      ppVal: false // 비밀번호 일치 유효성
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
    //   selectedExchange: response.data.exchange[0]
    // })
    // =========================================================================================================================================
    axios.get('Profile')
    .then( response => {
      this.setState({
        name: response.data.name,
        phone_number: response.data.phone_number,
        exchange: response.data.exchange, // 서버의 DB에서 받아온 거래소 정보 담긴 배열, 거래소 순서는 redux store에 저장된 거래소 배열의 순서와 같아야함
  
        selectedExchange: response.data.exchange[0]
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  // 거래소 선택 핸들 (이거 따라 거래소 키 밸류 바뀜)
  handleExchange = () => {
    this.setState({
      selectedExchange: this.state.exchange[document.getElementById('exchange').selectedIndex]
    })
  }

  // 각 정보 필드 변경시 핸들
  handleValue = (e) => {
    switch(e.target.id){
      case 'name':  // 이름
        return this.setState({ name: e.target.value })
      case 'phone_number':  // 전화번호
        return (!isNaN(e.target.value)) && this.setState({ phone_number: e.target.value })
      case 'newPassword': // 비밀번호 유효성 검사 (영문(대소문자 구분),숫자,특수문자 ~!@#$%^&*()-_? 만 허용)
        return (e.target.value.match(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/) && (e.target.value.length >= 8) && (e.target.value.length <= 16)) 
          ? this.setState({ password: e.target.value, pVal: true })
          : this.setState({ password: e.target.value, pVal: false })
      case 'newPasswordConfirm':  // 비밀번호 확인
        return (this.state.password === e.target.value)
          ? this.setState({ passwordC: e.target.value, ppVal: true })
          : this.setState({ passwordC: e.target.value, ppVal: false })
      case 'api_key':
        return this.setState({ selectedExchange: { ...this.state.selectedExchange, api_key: e.target.value } })
      case 'secret_key':
        return this.setState({ selectedExchange:{ ...this.state.selectedExchange, secret_key: e.target.value } })
      default:
    }
  }

  // 개인 정보 수정
  handleModPersonal = () => {
    if(window.confirm('수정하시겠습니까?')){
      axios.post(
        'Profile', 
        'item=profile'+
        '&name='+document.getElementById('name').value+
        '&phone_number='+document.getElementById('phone_number').value,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )
      .then( response => {
        this.setState({
          name: response.data.name,
          phone_number: response.data.phone_number
        })
        alert('수정이 완료되었습니다.')
      }) 
      .catch( response => { console.log('err\n'+response); } ) // ERROR
    }
  }

  // 비밀번호 수정
  handleModPassword = () => {
    if(this.state.pVal && this.state.ppVal){
      if(window.confirm('수정하시겠습니까?')){
        axios.post(
          'Profile', 
          'item=password'+
          '&old_password='+document.getElementById('oldPassword').value+
          '&password='+this.state.password,
          { 'Content-Type': 'application/x-www-form-urlencoded' }
        )
        .then( response => {
          switch(response.data){
            case 'wrongError':
              return alert('현재 비밀번호가 일치하지 않습니다.')
            case 'sameError':
            return alert('현재 비밀번호와 다른 비밀번호를 입력주세요.')
            default: return alert('변경이 완료되었습니다.')
          }
        }) 
        .catch( response => { console.log('err\n'+response); } ) // ERROR
      
      }

    }
  }
  
  // 거래소 정보 수정
  handleModExchange = () => {
    if(window.confirm('수정하시겠습니까?')){
      axios.post(
        'Profile', 
        'item=exchange'+
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
        alert('수정이 완료되었습니다.')
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
    const { selectedExchange, password, passwordC, pVal, ppVal } = this.state
    return (
      <div>
        <h4>개인 정보</h4>
        이름: <input id="name" value={this.state.name} onChange={this.handleValue}/><br/>
        휴대폰 번호: <input id="phone_number" value={this.state.phone_number} onChange={this.handleValue}/><br/>
        <button id="modPersonal" onClick={this.handleModPersonal}>수정</button>
        <h4>비밀번호 변경</h4>
        현재 비밀번호: <input id="oldPassword" type="password"/><br/>
        새로운 비밀번호: <input id="newPassword" type="password" onChange={this.handleValue}/><br/>
        비밀번호 확인: <input id="newPasswordConfirm" type="password" onChange={this.handleValue}/><br/>
        {((password !== '') && !pVal) && <a>올바른 비밀번호 형식이 아닙니다.<br/></a>}
        {((passwordC !== '') && pVal && !ppVal) && <a>비밀번호가 다릅니다.<br/></a>}
        <button id="modPassword" onClick={this.handleModPassword}>수정</button>
        <h4>거래소 정보</h4>
        <select id="exchange" onChange={this.handleExchange}>
          {exchangeList.map((exchange, index) => {
            return (<option key={index} > {exchange.key} </option>)
          })
          }
        </select><br/>
        API KEY: <input id="api_key" value={selectedExchange.api_key} onChange={this.handleValue}/><br/>
        SECRET KEY: <input id="secret_key" value={selectedExchange.secret_key} onChange={this.handleValue}/><br/>
        <button id="modExchange" onClick={this.handleModExchange}>수정</button><br/><br/><br/>
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

