import React, { Component } from 'react';
import axios from 'axios';

import './Sales.css';

const exchangeList = ["bithumb", "bittrex", "binance", "korbit", "coinone"]
const coinList = ["btc", "eth", "btg", "xrp", "eos", "ltc", "dog", "etc", "qtum"]
const baseList = ["krw", "usd"]
const intervalList = ["300", "1800", "3600", "21600", "43200", "86400"]

const today = new Date();

const yearList = [today.getFullYear(), today.getFullYear()-1]
const monthList = []
const dayList = []
const hourList = []

for(var i=1;i<=31;i++){
  if(i<=12) monthList.push(i)
  dayList.push(i)
  if(i<=24) hourList.push(i-1)  
}

class Sales extends Component {
  constructor(){
    super();
    this.state={
      serverStrategyList:[],
    }
  }

  componentDidMount() {
    axios.get( 'Strategy' )
    .then( response => {
      this.setState({
        serverStrategyList: response.data
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }
  handleStartbtn = () => {

    var now = new Date();
    
    var startDate = now.getFullYear()+'-'+
    ("0"+(now.getMonth()+1)).slice(-2)+'-'+
    ("0"+now.getDate()).slice(-2)+'T'+
    ("0"+now.getHours()).slice(-2)+':00:00.000'

    var endDate = document.getElementById('endYear').value+'-'+
    ("0"+document.getElementById('endMonth').value).slice(-2)+'-'+
    ("0"+document.getElementById('endDay').value).slice(-2)+'T'+
    ("0"+document.getElementById('endHour').value).slice(-2)+':00:00.000'

    let alertMsg = document.getElementById('botname').value + '\n' + 
      document.getElementById('exchange').value + '\n' +
      document.getElementById('coin').value + '\n' +
      document.getElementById('base').value + '\n' +
      document.getElementById('interval').value+ '\n' + 
      document.getElementById('strategy').value+ '\n' +
      document.getElementById('buyingSetting').value+ '\n' +
      document.getElementById('sellingSetting').value+ '\n' +
      endDate+ '\n' +
      '\n이 맞습니까?';

    alert(alertMsg);

    axios.post( 
      'TradeMain', 
      'status='+true+
      '&botname='+document.getElementById('botname').value+
      '&exchange='+document.getElementById('exchange').value+
      '&coin='+document.getElementById('coin').value+
      '&base='+document.getElementById('base').value+ 
      '&interval='+document.getElementById('interval').value+
      '&strategyName='+document.getElementById('strategy').value+
      '&buyingSetting='+document.getElementById('buyingSetting').value+
      '&sellingSetting='+document.getElementById('sellingSetting').value+
      '&startDate='+startDate+
      '&endDate='+endDate,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
  }

  render() {
    return (
      <div>        
        <h4 className="Sales-color">Sales configuration</h4>
        <input placeholder="이름" id="botname"/><br/>
        거래소 : <select id="exchange">
          {exchangeList.map((exchange, i) => {
            return (<option key={i}> {exchange} </option>)
          })
          }
        </select><br/>
        코인 : <select id="coin">
          {coinList.map((coin, i) => {
            return (<option key={i}> {coin} </option>)
          })}
        </select><br/>
        기축통화 : <select id="base">
          {baseList.map((base, i) => {
            return (<option key={i}> {base} </option>)
          })}
        </select><br/>
        거래 간격 : <select id="interval">
          {intervalList.map((int, i) => {
            return (<option key={i}> {int} </option>)
          })}
        </select><br/>
        전략 : <select id="strategy">
          {this.state.serverStrategyList.map((s, i) => {
            return (<option key={i}> {s.name} </option>)
          })}
        </select><br/>        
        구매 설정 : <select id="buyingSetting">
            <option key={i}> buyAll </option>
        </select><br/>
        판매 설정 : <select id="sellingSetting">
            <option key={i}> sellAll </option>
        </select><br/>
        종료일 : <select id="endYear">
          {yearList.map((e, i) => {
            return (<option key={i} selected={e === today.getFullYear()}> {e} </option>)
          })}
        </select>년
        <select id="endMonth">
          {monthList.map((e, i) => {
            return (<option key={i} selected={e === today.getMonth()+1}> {e} </option>)
          })}
        </select>월
        <select id="endDay">
          {dayList.map((e, i) => {        
            return (<option key={i} selected={e === today.getDate()}> {e} </option>)    
          })}
        </select>일
        <select id="endHour">
          {hourList.map((e, i) => {
            return (<option key={i} selected={e === today.getHours()}> {e} </option>)
          })}
        </select>시<br/>
        <button onClick={this.handleStartbtn}>거래 시작</button>
      </div>
    );
  }

}

export default Sales;