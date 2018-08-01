import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

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

const periodLimit = [ "1일", "1주일", "15일", "3개월", "3개월", "3개월" ]

class BackTesting extends Component {
  constructor(){
    super();
    this.state={
      exchangeIndex: 0,
      baseIndex: 0,
      
      isResulted:false,
      text:'',

      ReturnDetailMessage:'',
      ReturnMessage:''
    }
  }

  handleIndex = () => {
    this.setState({
      exchangeIndex: document.getElementById('exchange').selectedIndex,
      baseIndex: document.getElementById('base').selectedIndex
    })
  }

  dateValidate = (sD, eD) =>{
    var diff = new Date(eD) - new Date(sD)
    switch(document.getElementById('interval').value) {
      case "5분":
        if( diff > 0 && diff < 1*24*60*60*1000 )
          return true
        else return false
      case "30분":
        if( diff > 0 && diff < 7*24*60*60*1000 )
          return true
        else return false
      case "1시간":
        if( diff > 0 && diff < 15*24*60*60*1000 )
          return true
        else return false
      default:
        if( diff > 0 && diff < 90*24*60*60*1000 )
          return true
        else return false
    }
  }

  handleStartbtn = () => {
    var startDate = document.getElementById('startYear').value+'-'+
    ("0"+document.getElementById('startMonth').value).slice(-2)+'-'+
    ("0"+document.getElementById('startDay').value).slice(-2)+'T'+
    ("0"+document.getElementById('startHour').value).slice(-2)+':00:00.000'
    var endDate = document.getElementById('endYear').value+'-'+
    ("0"+document.getElementById('endMonth').value).slice(-2)+'-'+
    ("0"+document.getElementById('endDay').value).slice(-2)+'T'+
    ("0"+document.getElementById('endHour').value).slice(-2)+':00:00.000'

    if(this.dateValidate(startDate, endDate)){
      axios.post( 
        'BackTest', 
        'exchange='+document.getElementById('exchange').value+
        '&coin='+document.getElementById('coin').value+
        '&base='+document.getElementById('base').value+ 
        '&interval='+this.props.intervalList.value[document.getElementById('interval').selectedIndex]+
        '&strategyName='+document.getElementById('strategy').value+
        '&buyingSetting='+document.getElementById('buyingSetting').value+
        '&sellingSetting='+document.getElementById('sellingSetting').value+
        '&startDate='+startDate+
        '&endDate='+endDate+
        '&nowCash='+document.getElementById('nowCash').value,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )
      .then( response => {
        this.setState({
          isResulted: true,
          ReturnDetailMessage: response.data.ReturnDetailMessage,
          ReturnMessage: response.data.ReturnMessage,
          text: response.data.ReturnMessage
        })
      }) 
      .catch( response => { console.log('err\n'+response); } ); // ERROR
    } else alert(
      document.getElementById('interval').value +
      ' 간격의 거래는 ' +
      periodLimit[document.getElementById('interval').selectedIndex] +
      ' 이내의 기간으로 설정해주세요.')
  }

  handleResult = (e) => {
    if(e.target.id === "result"){
      this.setState({
        text:this.state.ReturnMessage
      })
    } else{
      this.setState({
        text:this.state.ReturnDetailMessage
      })
    }
  }

  render() {
    return (
      <div>        
        <h4 >Back Testing</h4>
        거래소 : <select id="exchange" onChange={this.handleIndex}>
          {this.props.exchangeList.map((exchange, index) => {
            return (<option key={index} > {exchange} </option>)
          })
          }
        </select><br/>
        기축통화 : <select id="base" onChange={this.handleIndex}>
          {this.props.exchange[this.state.exchangeIndex].baseList.map((base, i) => {
            return (<option key={i}> {base} </option>)
          })}
        </select><br/>
        코인 : <select id="coin">
          {this.props.exchange[this.state.exchangeIndex].coin[this.state.baseIndex].list.map((coin, i) => {
            return (<option key={i}> {coin} </option>)
          })}
        </select><br/>
        거래 간격 : <select id="interval">
          {this.props.intervalList.display.map((int, i) => {
            return (<option key={i}> {int} </option>)
          })}
        </select><br/>
        전략 : <select id="strategy">
          {this.props.strategyList.map((s, i) => {
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
            return (<option key={i} selected={e === today.getFullYear()}> {e} </option>)
          })}
        </select>년
        <select id="startMonth">
          {monthList.map((e, i) => {
            return (<option key={i} selected={e === today.getMonth()+1}> {e} </option>)
          })}
        </select>월
        <select id="startDay">
          {dayList.map((e, i) => {
            return (<option key={i} selected={e === today.getDate()}> {e} </option>)
          })}
        </select>일
        <select id="startHour">
          {hourList.map((e, i) => {
            return (<option key={i} selected={e === today.getHours()}> {e} </option>)
          })}
        </select>시
        <br/>  
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
        시작 금액 : <input placeholder="시작 금액" id="nowCash"/><br/>
        <button onClick={this.handleStartbtn}>백테스팅 시작</button>
        <h4 >결과</h4>
        {this.state.isResulted && 
          (<button id="result" onClick={(e)=>this.handleResult(e)}>결과 확인</button>)}
        {this.state.isResulted && 
          (<button id="detailResult" onClick={(e)=>this.handleResult(e)}>세부 정보</button>)}
        <br/>{this.state.isResulted && 
          (<textarea style={{height:500, width:"70%", resize:"none"}} readOnly value={this.state.text}/>)}
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

BackTesting = connect(mapStateToProps)(BackTesting);

export default BackTesting;

