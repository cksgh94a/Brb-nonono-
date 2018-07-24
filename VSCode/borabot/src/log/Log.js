import React, { Component } from 'react';
import axios from 'axios';


class Log extends Component {
  constructor(){
    super();
    this.state={
      serverTradeList: [],
      selectedTrade:'',
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
    .catch( response => { 
      console.log('err\n'+response); 
    }); // ERROR
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

    
    this.state.serverTradeList.map((t, i) => {
      if(e.target.value === t.bot_name) 
        this.setState({
          selectedTrade: t
        })
    })
  }

  render() {
    return (
      <div>
        <h4>봇 선택</h4>        
        봇 이름 : <select id="strategy" onChange={(e)=>this.handleChange(e)}>
          <option>선택하세요</option>
          {this.state.serverTradeList.map((t, i) => {
            return (<option key={i}> {t.bot_name} </option>)
          })}
        </select><br/>
        <h4>봇 기록</h4>        
        거래소 : <input value={this.state.selectedTrade.exchange_name} readOnly/>
        코인 : <input value={this.state.selectedTrade.coin} readOnly/><br/>
        <input value="거래 신호 시간" readOnly/><input value="매매 행동" readOnly/><input value="개당 코인 가격" readOnly/>
        <input value="코인 매매 수량" readOnly/><input value="현재 보유 현금" readOnly/><input value="현재 보유 코인수" readOnly/>
        {this.state.serverLogList.map((l, i) => {
          return (<div><input value={l.trans_time} readOnly/>{l.sales_action === "1" ?
            (<input value={"구매"} readOnly/>) :(<input value={"판매"} readOnly/>)}
            <input value={l.coin_price} readOnly/><input value={l.coin_intent} readOnly/>
            <input value={l.now_balance} readOnly/><input value={l.now_coin_number} readOnly/>
            </div>)
          })}
      </div>
    );
  }
}

export default Log;

