import React, { Component } from 'react';
import axios from 'axios';

const exchangeList = ["bithumb", "bittrex", "binance", "korbit", "coinone"]
const coinList = ["btc", "eth", "btg", "xrp", "eos", "ltc", "dog", "etc", "qtum"]
const baseList = ["krw", "usd"]
const intervalList = ["300", "1800", "3600", "21600", "43200", "86400"]

const today = new Date();

const yearList = [today.getFullYear()-1, today.getFullYear()]
const monthList = []
const dayList = []

const hourList = []


for(var i=1;i<=24;i++){
  if(i<=12) monthList.push(i)
  if(i<=31) dayList.push(i)
  hourList.push(i)
}

class BackTesting extends Component {
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

  handleStartbtn() {
    var startDate = document.getElementById('startYear').value+'-'+
    ("00"+document.getElementById('startMonth').value).slice(-2)+'-'+
    ("00"+document.getElementById('startDay').value).slice(-2)+'T'+
    ("00"+document.getElementById('startHour').value).slice(-2)+':00:00.000'
    var endDate = document.getElementById('endYear').value+'-'+
    ("00"+document.getElementById('endMonth').value).slice(-2)+'-'+
    ("00"+document.getElementById('endDay').value).slice(-2)+'T'+
    ("00"+document.getElementById('endHour').value).slice(-2)+':00:00.000'

    axios.post( 
      'BackTest', 
      'exchange='+document.getElementById('exchange').value+
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
        <h4 >Back Testing</h4>
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
        <select id="strategy">
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
        시작일 : <select id="startYear">
          {yearList.map((e, i) => {
            return (<option key={i}> {e} </option>)
          })}
        </select>년
        <select id="startMonth">
          {monthList.map((e, i) => {
            return (<option key={i}> {e} </option>)
          })}
        </select>월
        <select id="startDay">
          {dayList.map((e, i) => {
            return (<option key={i}> {e} </option>)
          })}
        </select>일
        <select id="startHour">
          {hourList.map((e, i) => {
            return (<option key={i}> {e} </option>)
          })}
        </select>시
        <br/>  
        종료일 : <select id="endYear">
          {yearList.map((e, i) => {
            return (<option key={i}> {e} </option>)
          })}
        </select>년
        <select id="endMonth">
          {monthList.map((e, i) => {
            return (<option key={i}> {e} </option>)
          })}
        </select>월
        <select id="endDay">
          {dayList.map((e, i) => {
            return (<option key={i}> {e} </option>)
          })}
        </select>일
        <select id="endHour">
          {hourList.map((e, i) => {
            return (<option key={i}> {e} </option>)
          })}
        </select>시<br/>
        <button onClick={this.handleStartbtn}>백테스팅 시작</button>
      </div>
    );
  }
}

export default BackTesting;

