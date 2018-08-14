import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import './BackTesting.css';
import toLeftBtn from '../img/common/pre_btn_01.png';
import toRightBtn from '../img/common/next_btn_01.png';
import onText from '../img/common/on_bg_01.png';
import offText from '../img/common/off_bg_01.png';
import startBtn from '../img/common/btn_08.png';
import calendar from '../img/common/calendar_01.png';

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

      // isResulted:false,
      // text:'',
      // ReturnDetailMessage:'',
      // ReturnMessage:'',
      
      buyDetail: false,
      sellDetail: false,
      buyUnit:'',
      sellUnit:'',
        
      pageNum:1,  // 현재 선택된 페이지 번호
      pageNumList: [1], // 게시물의 전체 페이지 리스트

      showList: [],
      resultList: [],
      result: {}
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
        sellUnit:'',
        
        pageNum:1,  // 현재 선택된 페이지 번호
        pageNumList: [1], // 게시물의 전체 페이지 리스트
  
        resultList: [],
        showList: [],
        result: {}
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
    // 항목 검증
    if(document.getElementById('nowCash').value === '') {
      alert('시작 금액을 입력하세요')
      return
    }
    
    const { startDay, endDay } = this.state
    var startDate = startDay.getFullYear()+'-'+
      ("0"+(startDay.getMonth()+1)).slice(-2)+'-'+
      ("0"+startDay.getDate()).slice(-2)+'T'+
      ("0"+document.getElementById('startHour').value).slice(0,-1).slice(-2)+':00:00.000'
    var endDate = endDay.getFullYear()+'-'+
      ("0"+(endDay.getMonth()+1)).slice(-2)+'-'+
      ("0"+endDay.getDate()).slice(-2)+'T'+
      ("0"+document.getElementById('endHour').value).slice(0,-1).slice(-2)+':00:00.000'

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
        '&buyingDetail='+document.getElementById('buyingDetail').value+
        '&sellingDetail='+document.getElementById('sellingDetail').value+
        '&startDate='+startDate+
        '&endDate='+endDate+
        '&nowCash='+document.getElementById('nowCash').value,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )
      .then( response => {
        if(response.data.status === '성공'){
          this.setState({
            resultList: response.data.log,
            result: response.data.result
          })
          var pNL = [1]  // state에 저장할 페이지리스트 생성
          for(var i = 2; i <= (response.data.log.length-1)/10+1; i++){
            pNL.push(i)
          }
          this.setState({
            logList: response.data.logList,
            pageNumList: pNL,
            showList: this.state.resultList.slice(0, 10)
          })
        } else alert('백테스팅에 실패하였습니다.')
      }) 
      .catch( response => { console.log('err\n'+response); } ); // ERROR
    } else alert(
      document.getElementById('interval').value +
      ' 간격의 거래는 ' +
      periodLimit[document.getElementById('interval').selectedIndex] +
      ' 이내의 기간으로 설정해주세요.')
  }

  // 페이지를 선택하면 state 변화후 게시물을 새로 불러옴
  selectPage = (fbn) => {
    const { pageNum, pageNumList } = this.state
    var pn = 1  // 서버에 호출할 페이지 번호

    if(fbn === 'front'){
      (pageNum > 10)
      ? pn = pageNum -(pageNum-1)%10 -1
      : pn = 1
    } else if(fbn === 'back'){
      (parseInt(pageNum/10, 10) !== parseInt(pageNumList.length/10, 10))
      ? pn = pageNum -pageNum%10 +11
      : pn = pageNumList.length
    } else pn = fbn
    
    this.setState({
      pageNum: pn,
      showList: this.state.resultList.slice((pn -1)*10, (pn -1)*10+10)
    })
  }

  // handleResult = (e) => {
  //   if(e.target.id === "result"){
  //     this.setState({
  //       text:this.state.ReturnMessage
  //     })
  //   } else{
  //     this.setState({
  //       text:this.state.ReturnDetailMessage
  //     })
  //   }
  // }

  render() {
    const { exchangeList, intervalList , strategyList } = this.props
    const { exchangeIndex, baseIndex, isResulted, text, pageNum, pageNumList, showList, result } = this.state
    
    const onTextBg = {
      backgroundImage : `url(${onText})`,
    }

    const offTextBg = {
      backgroundImage : `url(${offText})`,
    }

    return (
      <div>
        {/* 거래 설정 영역 */}
        <div className = 'bt-settingContainer'>          
          <div className = 'bt-btSettingText'>백테스팅 설정</div>
            {/* 거래소 선택 */}
            <select className = "bt-select" id="exchange" onChange={this.handleIndex}>
              {exchangeList.map((exchange, index) => {
                return (<option key={index} > {exchange.key} </option>)
              })}
            </select><br/>
            {/* 기축통화 선택 */}
            <select id="base" className = "bt-select" onChange={this.handleIndex}>
              {exchangeList[exchangeIndex].value.baseList.map((base, i) => {
                return (<option key={i}> {base} </option>)
              })}
            </select><br/>
            {/* 코인 선택 */}
            <select id="coin" className = "bt-select">
              {exchangeList[exchangeIndex].value.coin[baseIndex].list.map((coin, i) => {
                return (<option key={i}> {coin} </option>)
              })}
            </select>
            {/* 거래 간격 선택 */}
            <select id="interval" className = "bt-select">
              {intervalList.map((int, i) => {
                return (<option key={i}> {int.key} </option>)
              })}
            </select>
            {/* 전략 선택 */}
            <select id="strategy" className = "bt-select">
              {strategyList.map((s, i) => {
                return (<option key={i}> {s.name} </option>)
              })}
            </select>
            {/* 구매 설정 선택 */}
            <select id="buyingSetting" onChange={this.handleSetting} className = "bt-select">
              {buyingSetting.map((b, i) => { return (<option key={i}> {b.key} </option>) })}
            </select>
            <input id="buyingDetail" className = "bt-input-buySetting" hidden={!this.state.buyDetail}/>{this.state.buyDetail && this.state.buyUnit}
            {/* 판매 설정 선택 */}
            <select id="sellingSetting" onChange={this.handleSetting} className = "bt-select">
              {sellingSetting.map((s, i) => { return (<option key={i}> {s.key} </option>) })}
            </select>
            <input id="sellingDetail" className = "bt-input-sellSetting" hidden={!this.state.sellDetail}/>{this.state.sellDetail && this.state.sellUnit}
            {/* 시작일 선택 */}
            <div style = {{ maringTop : "12px", height : "42px"}}>
              <div style = {{ position:"absolute", borderBottom : "1px solid #9646a0", width : "81px", float : "left", marginLeft : "20px", marginTop : "4px"}}>
                <DayPickerInput inputProps={{
                  style: {
                    width: '80px',
                    marginTop : "20px",
                    borderTop : 'transparent',
                    borderLeft : 'transparent',
                    borderRight : 'transparent',
                    borderBottom : 'transparent'}
                  }} onDayChange={(day) => this.handleDayChange(day, 'start')} />
                <img src = {calendar} style = {{position : "absolute", top : '20px', left : '63px'}}/>
              </div>
              {/* 시작 시간 선택 */}
              <select className = "bt-select-hour" id="startHour">
                {hourList.map((e, i) => {
                  return (<option key={i}> {e}시 </option>)
                })}
              </select>
            </div>
            {/* 종료일 선택 */}
            <div style = {{ maringTop : "12px", height : "42px"}}>
              <div style = {{ position:"absolute", borderBottom : "1px solid #9646a0", width : "81px", float : "left", marginLeft : "20px", marginTop : "4px"}}>
                <DayPickerInput inputProps={{
                  style: {
                    width: '80px',
                    marginTop : "20px",
                    borderTop : 'transparent',
                    borderLeft : 'transparent',
                    borderRight : 'transparent',
                    borderBottom : 'transparent'}
                  }} onDayChange={(day) => this.handleDayChange(day, 'end')} />
                <img src = {calendar} style = {{position : "absolute", top : '20px', left : '63px'}}/>
              </div>
              {/* 종료 시간 선택 */}
              <select  className = "bt-select-hour" id="endHour">
                {hourList.map((e, i) => {
                  return (<option key={i}> {e}시 </option>)
                })}
              </select>
              {/* 시작 금액 선택 */}
              <input id="nowCash" placeholder="시작 금액을 입력하세요"  className = 'bt-startPrice' value={this.state.nowCash} onChange={this.handleCash}/><br/>
            </div>            
          {/* 시작 버튼 */}
          <div className = 'bt-start-btn' onClick={this.handleStartbtn}><img src = {startBtn}/></div>
        </div>

        {/* 거래 결과 기록 영역 */}
        <div className = 'bt-resultLogContainer'>
          <div>
            <div className = "log-botIndivText">매매 기록</div>
            <table className='log-tableContainer' >
              <thead>
                <th className='log-headTr'>성공 여부</th>
                <th className='log-headTr'>매매</th>
                <th className='log-headTr'>가격</th>
                <th className='log-headTr'>코인 매매 수량</th>
                <th className='log-headTr'>현재 보유 현금</th>
                <th className='log-headTr'>현재 보유 코인수</th>
                <th className='log-headTr'>시간</th>
              </thead>

              <tbody className = 'log-tbodyContainer' >              
                { // state에 저장된 게시물 리스트를 map 함수 통하여 표시
                showList.map((r, i) => {
                  return (<tr key={i} style={{borderBottom : "1px solid"}} >
                    <td className = 'log-td'>{r.success}</td>
                    <td className = 'log-td'>{r.saleAction}</td>
                    <td className = 'log-td'>{r.coinCurrentPrice}</td>
                    <td className = 'log-td'>{r.salingCoinNumber}</td>
                    <td className = 'log-td'>{r.nowCash}</td>
                    <td className = 'log-td'>{r.nowCoin}</td>
                    <td className = 'log-td'>{r.time}</td>
                  </tr>)
                })}
              </tbody>
            </table>

            <div className = "log-chooseBoxContainer">
              { /* 이전 10 페이지 이동 버튼*/ }
              <div className = "log-chooseLeft" onClick={() => this.selectPage('front')}> <img src = {toLeftBtn}/> </div>
              { // 현재 선택된 페이지의 근처 10개 페이지 표시
              pageNumList.slice(pageNum -(pageNum-1)%10 -1, pageNum -(pageNum-1)%10 +9).map((p, i) => {
                return(<div  key ={i} onClick={() => this.selectPage(p)}>
                  {pageNum === p ? <div style={onTextBg} className = "log-chooseNumberSelected" >  {p}  </div> : <div style={offTextBg} className = "log-chooseNumber" >  {p}  </div>}
                </div>)
              })}
              { /* 이후 10 페이지 이동 버튼*/ }
              <div className = "log-chooseRight" onClick={() => this.selectPage('back')}><img src = {toRightBtn}/></div>
            </div>
          </div>
        </div>

        {/* 거래 결과 영역 */}
        <div className = 'bt-resultWindow'>
          <div style={{marginTop : '30px', marginLeft : '30px', fontSize : "24px", fontWeight:"bold"}}>백테스팅 결과</div>
          <div style={{marginTop : '20px', marginLeft : '30px', width : "236px", borderBottom : '1px solid #9646a0'}} /> 
          {/* {isResulted && 
            (<button id="result" onClick={(e)=>this.handleResult(e)}>결과 확인</button>)}
          {isResulted && 
            (<button id="detailResult" onClick={(e)=>this.handleResult(e)}>세부 정보</button>)}<br/>
          {isResulted && 
            (<textarea style={{height:500, width:"70%", resize:"none"}} readOnly value={text}/>)} */}
        </div>
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

