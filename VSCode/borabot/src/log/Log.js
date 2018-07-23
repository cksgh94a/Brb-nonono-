import React, { Component } from 'react';
import axios from 'axios';


class Log extends Component {
  constructor(){
    super();
    this.state={
      serverTradeList: [],
      serverLogList: []
    }
  }

  componentDidMount() {
    axios.get( 'Log' )
    .then( response => {
      this.setState({
        serverTradeList: response.data
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  handleChange = (e) => {
    axios.post('Log', 
    'bot_name='+e.target.value,
    { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
    .then( response => {
      this.setState({
        serverLogList: response.data
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  render() {
    return (
      <div>
        <h4>봇 선택</h4>        
        봇 이름 : <select id="strategy" onChange={(e)=>this.handleChange(e)}>
          {this.state.serverTradeList.map((t, i) => {
            return (<option key={i}> {t} </option>)
          })}
        </select><br/>
        <h4>봇 기록</h4>        
        거래소 : <input value={this.state.serverTradeList.exchange_name} readOnly/>
        코인 : <input value={this.state.serverTradeList.coin} readOnly/><br/>
        <input value="거래 신호 시간" readOnly/><input value="매매 행동" readOnly/><input value="개당 코인 가격" readOnly/>
        <input value="코인 매매 수량" readOnly/><input value="현재 보유 현금" readOnly/><input value="현재 보유 코인수" readOnly/>
        {this.state.serverLogList.map((l, i) => {
          return ((<input value={l.trans_time} readOnly/>)(<input value={l.sales_action} readOnly/>)(<input value={l.coin_price} readOnly/>)
            (<input value={l.coin_intent} readOnly/>)(<input value={l.now_balance} readOnly/>)(<input value={l.now_coin_number} readOnly/>)
            )
          })}
      </div>
    );
  }
}

export default Log;

