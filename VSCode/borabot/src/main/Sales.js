import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import { setSales } from '../reducers/sales';

import './Sales.css';

import startBtn from '../img/common/btn_03.png';
import calendar from '../img/common/calendar_01.png';

// 시간 선택 리스트
const hourList = []
for(var i=1;i<=24;i++) hourList.push(i-1)  

// 구매, 판매 설정 리스트
const buyingSetting = [ {key: '전액구매', value: 'buyAll'}, {key: '금액구매', value: 'buyCertainPrice'}, {key: '개수구매', value: 'buyCertainNum'} ]
const sellingSetting = [ {key: '전액판매', value: 'sellAll'}, {key: '금액판매', value: 'sellCertainPrice'}, {key: '개수판매', value: 'sellCertainNum'} ]


class Sales extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDay: new Date(), // 선택한 날짜
      
      buyDetail: false,
      sellDetail: false,
      buyUnit:'',
      sellUnit:''
    };
  }

  // 날짜 변경 핸들
  handleDayChange = (day) => {
    this.setState({ selectedDay: day });
  }

  // 거래 설정 값들의 인덱스 저장 (차트 표시용 인덱스)
  handleIndex = (e) => {
    if (e.target.id === 'salesExchange'){
      document.getElementById('salesBase').selectedIndex = 0
      document.getElementById('salesCoin').selectedIndex = 0
    } else if(e.target.id === 'salesBase') document.getElementById('salesCoin').selectedIndex = 0
    this.props.onSetSales({
      sales: true,
      exchangeIndex: document.getElementById('salesExchange').selectedIndex,
      baseIndex: document.getElementById('salesBase').selectedIndex,
      coinIndex: document.getElementById('salesCoin').selectedIndex,
      intervalIndex: document.getElementById('salesInterval').selectedIndex
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

  // 거래 시작 버튼 클릭 시
  handleStartbtn = () => {
    // 봇 이름 검증
    if(document.getElementById('botname').value === ''){
      alert('😆 당신의 지갑을 풍족하게 해줄 귀여운 봇의 이름을 지어주세요 😆')
      return
    }

    // 종료일 검증
    const { selectedDay } = this.state
    // 종료일 문자열 생성
    var endDate = selectedDay.getFullYear()+'-'+
      ("0"+(selectedDay.getMonth()+1)).slice(-2)+'-'+
      ("0"+selectedDay.getDate()).slice(-2)+'T'+
      ("0"+document.getElementById('endHour').value).slice(0,-1).slice(-2)+':00:00.000'
    var now = new Date();
    if(new Date(endDate) - now < 0){
      alert('😆 거래 종료를 과거에 할 순 없어요 😆')
      return
    }
    
    // 시작일 문자열 생성
    var startDate = now.getFullYear()+'-'+
      ("0"+(now.getMonth()+1)).slice(-2)+'-'+
      ("0"+now.getDate()).slice(-2)+'T'+
      ("0"+now.getHours()).slice(-2)+':'+
      ("0"+now.getMinutes()).slice(-2)+':'+
      ("0"+now.getSeconds()).slice(-2)+'.000'

    // 거래 확인 메세지
    let alertMsg = document.getElementById('botname').value + '\n' + 
      document.getElementById('salesExchange').value+ '\n' +
      document.getElementById('salesBase').value+ '\n' +
      document.getElementById('salesCoin').value+ '\n' +
      document.getElementById('salesInterval').value+ '\n' +
      document.getElementById('strategy').value+ '\n' +
      document.getElementById('buyingSetting').value+ '\n' +
      document.getElementById('buyingDetail').value+ '\n' +
      document.getElementById('sellingSetting').value+ '\n' +
      document.getElementById('sellingDetail').value+ '\n' +
      endDate+ '\n' +
      '\n이 맞습니까?';

    // 최종 확인 후 거래 시작 (서버에 거래 정보 전송)
    if(window.confirm(alertMsg)){
      axios.post( 
        'TradeMain', 
        'status='+true+
        '&botname='+document.getElementById('botname').value+
        '&exchange='+document.getElementById('salesExchange').value+
        '&base='+document.getElementById('salesBase').value+
        '&coin='+document.getElementById('salesCoin').value+
        '&interval='+this.props.intervalList[this.props.sales.intervalIndex].value+
        '&strategyName='+document.getElementById('strategy').value+
        '&buyingSetting='+buyingSetting[document.getElementById('buyingSetting').selectedIndex].value+
        '&sellingSetting='+sellingSetting[document.getElementById('sellingSetting').selectedIndex].value+
        '&buyingDetail='+document.getElementById('buyingDetail').value+
        '&sellingDetail='+document.getElementById('sellingDetail').value+
        '&startDate='+startDate+
        '&endDate='+endDate,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )
      alert('거래가 시작되었습니다.')
    } else alert('취소되었습니다.')
  }

  render() {
    const { exchangeList, intervalList, strategyList } = this.props
    const { exchangeIndex, baseIndex } = this.props.sales

    return (
      <div style={{color:"grey"}}>        
        <h4 style={{textAlign : "center"}}>Sales configuration</h4>

        <input placeholder="이름" id="botname" className = 'select-botName' size = '1'/>

        <select className='sales-select' placeholder={'거래소'} id="salesExchange" onChange={this.handleIndex}  >
          {exchangeList.map((exchange, index) => {
            return (<option key={index} > {exchange.key} </option>)
          })}
        </select>

        <select className='sales-select' id="salesBase" onChange={this.handleIndex}  >
          {exchangeList[exchangeIndex].value.baseList.map((base, i) => {
            return (<option key={i}> {base} </option>)
          })}
        </select>

        <select className='sales-select' id="salesCoin" onChange={this.handleIndex}>
          {exchangeList[exchangeIndex].value.coin[baseIndex].list.map((coin, i) => {
            return (<option key={i}> {coin} </option>)
          })}
        </select>

        <select className='sales-select' id="salesInterval" onChange={this.handleIndex}>
          {intervalList.map((int, i) => {
            return (<option key={i}> {int.key} </option>)
          })}
        </select>

        <select className='sales-select' id="strategy">
          {strategyList.map((s, i) => {
            return (<option key={i}> {s.name} </option>)
          })}
        </select>       

        <select className='sales-select' id="buyingSetting" onChange={this.handleSetting}>
          {buyingSetting.map((b, i) => { return (<option key={i}> {b.key} </option>) })}
        </select>
        <input className = 'input-buySetting' id="buyingDetail" hidden={!this.state.buyDetail}/>{this.state.buyDetail && this.state.buyUnit}

        <select className='sales-select' id="sellingSetting" onChange={this.handleSetting}>
          {sellingSetting.map((s, i) => { return (<option key={i}> {s.key} </option>) })}
        </select>
        <input className = 'input-sellSetting' id="sellingDetail" hidden={!this.state.sellDetail}/>{this.state.sellDetail && this.state.sellUnit}
        
       <div style = {{ maringTop : "12px", height : "42px"}}>
          <div style = {{ position:"absolute", borderBottom : "1px solid #9646a0", width : "81px", float : "left", marginLeft : "20px", marginTop : "4px"}}>
            <DayPickerInput inputProps={{ style: { width: '80px', marginTop : "20px", borderTop : 'transparent', borderLeft : 'transparent', borderRight : 'transparent', borderBottom : 'transparent'} }} onDayChange={this.handleDayChange}/>
            <img src = {calendar} style = {{position : "absolute", top : '20px', left : '63px'}}/>
          </div>
          <select id="endHour" className='select_hour'>
            {hourList.map((e, i) => {
              return (<option key={i} selected={e === new Date().getHours()}> &nbsp; {e}시 </option>)
            })}
          </select>
       </div>
       
        <div className = 'sales-start-btn' onClick={this.handleStartbtn}><img src = {startBtn}/></div>
      </div>
    );
  }

}

let mapDispatchToProps = (dispatch) => {
  return {
    onSetSales: (value) => dispatch(setSales(value))
  }
}

let mapStateToProps = (state) => {
  return {
    strategyList: state.strategy.strategyList,
    exchangeList: state.exchange.exchangeList,
    intervalList: state.exchange.intervalList,

    sales: state.sales
  };
}

Sales = connect(mapStateToProps, mapDispatchToProps)(Sales);

export default Sales;