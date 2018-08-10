import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

const hourList = []
for(var i=1;i<=24;i++) hourList.push(i-1) 

const periodLimit = [ "1일", "1주일", "15일", "3개월", "3개월", "3개월" ]

// 구매, 판매 설정 리스트
const buyingSetting = [ {key: '전액구매', value: 'buyAll'}, {key: '금액구매', value: 'buyCertainPrice'}, {key: '개수구매', value: 'buyCertainNum'} ]
const sellingSetting = [ {key: '전액판매', value: 'sellAll'}, {key: '금액판매', value: 'sellCertainPrice'}, {key: '개수판매', value: 'sellCertainNum'} ]

class BackTesting extends Component {
  constructor(){
    super();
    this.state={
      exchangeIndex: 0,
      baseIndex: 0,
      startDay: '',
      endDay: '',
      nowCash:'',

      isResulted:false,
      text:'',
      ReturnDetailMessage:'',
      ReturnMessage:'',
      
      buyDetail: false,
      sellDetail: false,
      buyUnit:'',
      sellUnit:''
    }
  }

  // 현재 페이지에서 새로고침을 위해 메뉴를 다시 눌렀을 경우 스테이트 초기화
  componentWillReceiveProps (nextProps) {
    if(this.props.location.key !== nextProps.location.key) {
      this.setState({
        exchangeIndex: 0,
        baseIndex: 0,
        startDay: '',
        endDay: '',
        nowCash:'',
  
        isResulted:false,
        text:'',
        ReturnDetailMessage:'',
        ReturnMessage:'',
        
        buyDetail: false,
        sellDetail: false,
        buyUnit:'',
        sellUnit:''
      })
      document.getElementById('exchange').selectedIndex = 0
      document.getElementById('base').selectedIndex = 0
      document.getElementById('coin').selectedIndex = 0
      document.getElementById('interval').selectedIndex = 0
      document.getElementById('buyingSetting').selectedIndex = 0
      document.getElementById('sellingSetting').selectedIndex = 0
      document.getElementById('startHour').selectedIndex = 0
      document.getElementById('endHour').selectedIndex = 0
      document.getElementById('buyingDetail').value = ''
      document.getElementById('sellingDetail').value = ''
    }
  }

  handleIndex = (e) => {
    if (e.target.id === 'exchange'){
      document.getElementById('base').selectedIndex = 0
      document.getElementById('coin').selectedIndex = 0
    } else if(e.target.id === 'base') document.getElementById('coin').selectedIndex = 0
    this.setState({
      exchangeIndex: document.getElementById('exchange').selectedIndex,
      baseIndex: document.getElementById('base').selectedIndex
    })
  }

  handleSetting = (e) => {
    switch(e.target.value){
      case '전액구매':
        return( this.setState({ buyDetail: false }) )
      case '금액구매':
        return( this.setState({ buyDetail: true, buyUnit: '원' }) )
      case '개수구매':
        return( this.setState({ buyDetail: true, buyUnit: '개' }) )
      case '전액판매':
        return( this.setState({ sellDetail: false }) )
      case '금액판매':
        return( this.setState({ sellDetail: true, sellUnit: '원' }) )
      case '개수판매':
        return( this.setState({ sellDetail: true, sellUnit: '개' }) )
      default: break
    }
  }

  handleDayChange = (day, se) => {
    se === 'start'
    ? this.setState({ startDay: day })
    : this.setState({ endDay: day })
  }

  handleCash = (e) => {
    !isNaN(e.target.value) && this.setState({
      nowCash:e.target.value
      // nowCash:Number(e.target.value).toLocaleString('en')  // 3자리마다 , 찍는건데 숫자 형식이 아니라 안됨
    })
  }

  dateValidate = (sD, eD) =>{
    console.log(sD)
    var diff = new Date(eD) - new Date(sD)

    console.log(diff)
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
    // 항목 검증
    if(document.getElementById('nowCash').value === '') {
      alert('시작 금액을 입력하세요')
      return
    }

    const { startDay, endDay } = this.state
    var startDate = startDay.getFullYear()+'-'+
      ("0"+(startDay.getMonth()+1)).slice(-2)+'-'+
      ("0"+startDay.getDate()).slice(-2)+'T'+
      ("0"+document.getElementById('startHour').value).slice(1,3)+':00:00.000'
    var endDate = endDay.getFullYear()+'-'+
      ("0"+(endDay.getMonth()+1)).slice(-2)+'-'+
      ("0"+endDay.getDate()).slice(-2)+'T'+
      ("0"+document.getElementById('endHour').value).slice(1,3)+':00:00.000'

    if(this.dateValidate(startDate, endDate)){
      axios.post( 
        'BackTest', 
        'exchange='+document.getElementById('exchange').value+
        '&coin='+document.getElementById('coin').value+
        '&base='+document.getElementById('base').value+ 
        '&interval='+this.props.intervalList[document.getElementById('interval').selectedIndex].value+
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
    const { exchangeList, intervalList , strategyList } = this.props
    const { exchangeIndex, baseIndex,isResulted, text } = this.state
    return (
      <div>        
        <h4 >Back Testing</h4>
        거래소 : <select id="exchange" onChange={this.handleIndex}>
          {exchangeList.map((exchange, index) => {
            return (<option key={index} > {exchange.key} </option>)
          })
          }
        </select><br/>
        기축통화 : <select id="base" onChange={this.handleIndex}>
          {exchangeList[exchangeIndex].value.baseList.map((base, i) => {
            return (<option key={i}> {base} </option>)
          })}
        </select><br/>
        코인 : <select id="coin">
          {exchangeList[exchangeIndex].value.coin[baseIndex].list.map((coin, i) => {
            return (<option key={i}> {coin} </option>)
          })}
        </select><br/>
        거래 간격 : <select id="interval">
          {intervalList.map((int, i) => {
            return (<option key={i}> {int.key} </option>)
          })}
        </select><br/>
        전략 : <select id="strategy">
          {strategyList.map((s, i) => {
            return (<option key={i}> {s.name} </option>)
          })}
        </select><br/>
        구매 설정 : <select id="buyingSetting" onChange={this.handleSetting}>
          {buyingSetting.map((b, i) => { return (<option key={i}> {b.key} </option>) })}
        </select>
        <input id="buyingDetail" hidden={!this.state.buyDetail}/>{this.state.buyUnit}<br/>
        판매 설정 : <select id="sellingSetting" onChange={this.handleSetting}>
          {sellingSetting.map((s, i) => { return (<option key={i}> {s.key} </option>) })}
        </select>
        <input id="sellingDetail" hidden={!this.state.sellDetail}/>{this.state.sellUnit}<br/>
        시작일 :
        <DayPickerInput onDayChange={(day) => this.handleDayChange(day, 'start')} />
        <select id="startHour">
          {hourList.map((e, i) => {
            return (<option key={i}> {e}시 </option>)
          })}
        </select>
        <br/>  
        종료일 :
        <DayPickerInput onDayChange={(day) => this.handleDayChange(day, 'end')} />
        <select id="endHour">
          {hourList.map((e, i) => {
            return (<option key={i}> {e}시 </option>)
          })}
        </select><br/>
        시작 금액 : <input id="nowCash" placeholder="시작 금액을 입력하세요" value={this.state.nowCash} onChange={this.handleCash}/><br/>
        <button onClick={this.handleStartbtn}>백테스팅 시작</button>
        <h4 >결과</h4>
        {isResulted && 
          (<button id="result" onClick={(e)=>this.handleResult(e)}>결과 확인</button>)}
        {isResulted && 
          (<button id="detailResult" onClick={(e)=>this.handleResult(e)}>세부 정보</button>)}<br/>
        {isResulted && 
          (<textarea style={{height:500, width:"70%", resize:"none"}} readOnly value={text}/>)}
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    strategyList: state.strategy.strategyList,
    exchangeList: state.exchange.exchangeList,
    intervalList: state.exchange.intervalList
  };
}

BackTesting = connect(mapStateToProps)(BackTesting);

export default BackTesting;

