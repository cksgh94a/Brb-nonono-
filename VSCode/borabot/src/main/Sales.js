import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import './Sales.css';

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
  constructor(props) {
    super(props);

    this.state = {
      exchangeIndex: 0,
      baseIndex: 0,
      selectedDay: new Date()
    };
  }

  handleDayChange = (day) => {
    this.setState({ selectedDay: day });
  }

  handleIndex = () => {
    this.setState({
      exchangeIndex: document.getElementById('exchange').selectedIndex,
      baseIndex: document.getElementById('base').selectedIndex
    })
  }

  handleStartbtn = () => {
    var now = new Date();
    
    var startDate = now.getFullYear()+'-'+
      ("0"+(now.getMonth()+1)).slice(-2)+'-'+
      ("0"+now.getDate()).slice(-2)+'T'+
      ("0"+now.getHours()).slice(-2)+':'+
      ("0"+now.getMinutes()).slice(-2)+':'+
      ("0"+now.getSeconds()).slice(-2)+'.000'

    var endDate = this.state.selectedDay.getFullYear()+'-'+
      ("0"+this.state.selectedDay.getMonth()+1).slice(-2)+'-'+
      ("0"+this.state.selectedDay.getDate()).slice(-2)+'T'+
      ("0"+document.getElementById('endHour').value).slice(-2)+':00:00.000'

    if(document.getElementById('botname').value === ''){
      alert('😆 당신의 지갑을 풍족하게 해줄 귀여운 봇의 이름을 지어주세요 😆')
      return
    }

    if(new Date(endDate) - now < 0){
      alert('😆 거래 종료를 과거에 할 순 없어요 😆')
      return
    }

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

    if(window.confirm(alertMsg)){
      axios.post( 
        'TradeMain', 
        'status='+true+
        '&botname='+document.getElementById('botname').value+
        '&exchange='+document.getElementById('exchange').value+
        '&coin='+document.getElementById('coin').value+
        '&base='+document.getElementById('base').value+ 
        '&interval='+this.props.intervalList.value[document.getElementById('interval').selectedIndex]+
        '&strategyName='+document.getElementById('strategy').value+
        '&buyingSetting='+document.getElementById('buyingSetting').value+
        '&sellingSetting='+document.getElementById('sellingSetting').value+
        '&startDate='+startDate+
        '&endDate='+endDate,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )
      alert('거래가 시작되었습니다.')
    } else alert('취소되었습니다.')
  }

  render() {
    const { exchangeList, exchange, intervalList, strategyList } = this.props
    const { exchangeIndex, baseIndex } = this.state
    return (
      <div>        
        <h4 className="Sales-color">Sales configuration</h4>
        <input placeholder="이름" id="botname"/><br/>
        거래소 : <select id="exchange" onChange={this.handleIndex}>
          {exchangeList.map((exchange, index) => {
            return (<option key={index} > {exchange} </option>)
          })
          }
        </select><br/>
        기축통화 : <select id="base" onChange={this.handleIndex}>
          {exchange[exchangeIndex].baseList.map((base, i) => {
            return (<option key={i}> {base} </option>)
          })}
        </select><br/>
        코인 : <select id="coin">
          {exchange[exchangeIndex].coin[baseIndex].list.map((coin, i) => {
            return (<option key={i}> {coin} </option>)
          })}
        </select><br/>
        거래 간격 : <select id="interval">
          {intervalList.display.map((int, i) => {
            return (<option key={i}> {int} </option>)
          })}
        </select><br/>
        전략 : <select id="strategy">
          {strategyList.map((s, i) => {
            return (<option key={i}> {s.name} </option>)
          })}
        </select><br/>        
        구매 설정 : <select id="buyingSetting">
            <option key={i}> buyAll </option>
        </select><br/>
        판매 설정 : <select id="sellingSetting">
            <option key={i}> sellAll </option>
        </select><br/>
        종료일 : 
        <DayPickerInput onDayChange={this.handleDayChange} />
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

let mapStateToProps = (state) => {
  return {
    strategyList: state.strategy.strategyList,
    exchangeList: state.exchange.exchangeList,
    exchange: state.exchange.exchange,
    intervalList: state.exchange.intervalList
  };
}

Sales = connect(mapStateToProps)(Sales);

export default Sales;