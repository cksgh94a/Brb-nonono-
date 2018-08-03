import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { setStrategy } from '../reducers/strategy';

var RSI = { indicator:'RSI', weight:1, period:14, buyIndex:30, sellIndex:70 }
var BollingerBand = { indicator:'BollingerBand', weight:1, period:20, mul:2 }
var CCI = { indicator:'CCI', weight:1, period:20, buyIndex:-100, sellIndex:100 }
var gdCross = { indicator:'gdCross', weight:1, longD:26, shortD:9, mT:1 }
var gdVCross = { indicator:'gdVCross', weight:1, longD:26, shortD:9, mT:1}
var MFI = { indicator:'MFI', weight:1, period:14, buyIndex:0, sellIndex:0 }
var StochOsc = { indicator:'StochOsc', weight:1, n:15, m:5, t:3 }
var VolumeRatio = { indicator:'VolumeRatio', weight:1, period:20, buyIndex:70, sellIndex:350 }
var pCorr = { indicator:'pCorr', weight:1, period:15, cor:0 }

// 지표 기본값
var defaultRSI = { indicator:'RSI', weight:1, period:14, buyIndex:30, sellIndex:70 }
var defaultBollingerBand = { indicator:'BollingerBand', weight:1, period:20, mul:2 }
var defaultCCI = { indicator:'CCI', weight:1, period:20, buyIndex:-100, sellIndex:100 }
var defaultgdCross = { indicator:'gdCross', weight:1, longD:26, shortD:9, mT:1 }
var defaultgdVCross = { indicator:'gdVCross', weight:1, longD:26, shortD:9, mT:1}
var defaultMFI = { indicator:'MFI', weight:1, period:14, buyIndex:0, sellIndex:0 }
var defaultStochOsc = { indicator:'StochOsc', weight:1, n:15, m:5, t:3 }
var defaultVolumeRatio = { indicator:'VolumeRatio', weight:1, period:20, buyIndex:70, sellIndex:350 }
var defaultpCorr = { indicator:'pCorr', weight:1, period:15, cor:0 }

var indicatorList = [RSI, BollingerBand, CCI, gdCross, gdVCross, MFI, StochOsc, VolumeRatio, pCorr]
var defaultIndicatorList = [defaultRSI, defaultBollingerBand, defaultCCI, defaultgdCross, defaultgdVCross, defaultMFI, defaultStochOsc, defaultVolumeRatio, defaultpCorr]


class Strategy extends Component {
  constructor(){
    super();
    this.state={
      name: '',
      selectedIndicator: RSI, // 설정된 지표
      defaultIndicator: defaultRSI, // 설정된 지표의 기본값
      calculate: 'or', // 연산 방법
      buyC: '', // 구매 기준
      sellC: '',  // 판매 기준

      indicatorList: [],  // 설정된 지표 리스트
      expList: [],  // 지표 연산 방법 리스트
      savedCnt: 0,  // 설정된 지표 개수
      jsonString:'', // 서버에 보내기 위한 json

      selectedStrategy:'',
      buttonVal: false
    }
  }

  // 지표 select box 변화에 따른 현재 선택된 지표와 기본값 state 변화
  handleIndicator = (e) => {
    indicatorList.map((idc) => {
      if(idc.indicator === e.target.value){
        this.setState({
          selectedIndicator: idc
        })
      }
    })
    defaultIndicatorList.map((didc) => {
      if(didc.indicator === e.target.value){
        this.setState({
          defaultIndicator: didc
        })
      }
    })
  }

  handleLoad = (e) => {
    // 새로 만들기 선택하면 기존에 만든 것 초기화
    if(e.target.value === '새로 만들기'){
      this.setState({
        name: '',
        selectedIndicator: RSI, // 설정된 지표
        defaultIndicator: defaultRSI, // 설정된 지표의 기본값
        calculate: 'or', // 연산 방법
        buyC:0, // 구매 기준
        sellC:0,  // 판매 기준
  
        indicatorList: [],  // 설정된 지표 리스트
        expList: [],  // 지표 연산 방법 리스트
        savedCnt: 0,  // 설정된 지표 개수
        jsonString:'', // 서버에 보내기 위한 json
        buttonVal: false
      })
    } else{
      this.setState({
        buttonVal: true
      })
      this.props.strategyList.map((s) => {
        if(e.target.value === s.name) {
          this.setState({
            selectedStrategy: JSON.parse(s.data)
          })
        }
      })
    }
  }

  handleCriteria = (e, bs) => {
    if(!isNaN(e.target.value)){
      (bs === 'buy')
        ? this.setState({
          buyC:e.target.value
        })
        : this.setState({
          sellC:e.target.value
        })
    }
  }

  // 설정한 지표 저장 및 리스트, json 저장
  handleSave = (e) => {
    const { selectedIndicator, jsonString, savedCnt, expList, defaultIndicator, calculate } = this.state

    // 현재 설정된 지표 세부 설정 저장
    if(document.getElementById('weight').value === '') selectedIndicator.weight = defaultIndicator.weight
    else selectedIndicator.weight = document.getElementById('weight').value

    if(selectedIndicator.period === undefined) {}
    else if(document.getElementById('period').value === '') selectedIndicator.period = defaultIndicator.period
    else selectedIndicator.period = document.getElementById('period').value

    if(selectedIndicator.buyIndex === undefined) {}
    else if(document.getElementById('buyIndex').value === '') selectedIndicator.buyIndex = defaultIndicator.buyIndex
    else selectedIndicator.buyIndex = document.getElementById('buyIndex').value

    if(selectedIndicator.sellIndex === undefined) {}
    else if(document.getElementById('sellIndex').value === '') selectedIndicator.sellIndex = defaultIndicator.sellIndex
    else selectedIndicator.sellIndex = document.getElementById('sellIndex').value

    if(selectedIndicator.mul === undefined) {}
    else if(document.getElementById('mul').value === '') selectedIndicator.mul = defaultIndicator.mul
    else selectedIndicator.mul = document.getElementById('mul').value

    if(selectedIndicator.longD === undefined) {}
    else if(document.getElementById('longD').value === '') selectedIndicator.longD = defaultIndicator.longD
    else selectedIndicator.longD = document.getElementById('longD').value

    if(selectedIndicator.shortD === undefined) {}
    else if(document.getElementById('shortD').value === '') selectedIndicator.shortD = defaultIndicator.shortD
    else selectedIndicator.shortD = document.getElementById('shortD').value

    if(selectedIndicator.mT === undefined) {}
    else if(document.getElementById('mT').value === '') selectedIndicator.mT = defaultIndicator.mT
    else selectedIndicator.mT = document.getElementById('mT').value

    if(selectedIndicator.n === undefined) {}
    else if(document.getElementById('n').value === '') selectedIndicator.n = defaultIndicator.n
    else selectedIndicator.n = document.getElementById('n').value

    if(selectedIndicator.m === undefined) {}
    else if(document.getElementById('m').value === '') selectedIndicator.m = defaultIndicator.m
    else selectedIndicator.m = document.getElementById('m').value

    if(selectedIndicator.t === undefined) {}
    else if(document.getElementById('t').value === '') selectedIndicator.t = defaultIndicator.t
    else selectedIndicator.t = document.getElementById('t').value

    if(selectedIndicator.cor === undefined) {}
    else if(document.getElementById('cor').value === '') selectedIndicator.cor = defaultIndicator.cor
    else selectedIndicator.cor = document.getElementById('cor').value

    var tempJson = jsonString

    if(savedCnt === 0) {
      this.setState({
        buttonVal: false,
        indicatorList: indicatorList.concat(selectedIndicator),
        savedCnt: savedCnt + 1,
        jsonString: '"'+savedCnt+'":'+JSON.stringify(selectedIndicator)
      })
    } else {
      this.setState({
        name: document.getElementById('name').value,
        indicatorList: indicatorList.concat(selectedIndicator),
        expList: expList.concat(calculate),
        savedCnt: savedCnt + 1,
        jsonString: tempJson+',"'+savedCnt+'":'+JSON.stringify(selectedIndicator)
      })
    }
  }
  
  handleComplete = () => {
    // 항목 검증
    if(this.state.name === '') {
      alert('전략 이름을 입력하세요')
      return
    }
    if(this.state.buyC === '') {
      alert('구매 기준치를 입력하세요')
      return
    }
    if(this.state.sellC === '') {
      alert('판매 기준치를 입력하세요')
      return
    }
    
    if(window.confirm("전략을 저장하시겠습니까?")){
      var send = '{"indicatorList":{'+this.state.jsonString+'},"buyCriteria":'+this.state.buyC+',"sellCriteria":'+this.state.sellC+',"expList":"'+this.state.expList+'"}'
  
      // DB에 새로운 전략 저장
      axios.post(
        'Strategy', 
        'name='+this.state.name+'&data='+send, 
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )
      .then( response => {
        this.props.onStoreStrategy(response.data)
      }) 
      .catch( response => { console.log('err\n'+response); } ); // ERROR로
    }
  }

  render() {
    const { selectedIndicator, buttonVal, jsonString, savedCnt, expList, selectedStrategy } = this.state
    return (
      <div>
        <h4>불러오기</h4>
        <select id="serverStrategy" onChange={(e)=>this.handleLoad(e)}>
          <option>새로 만들기</option>
          {
            this.props.strategyList.map((e, i) => {
            return (<option key={i}> {e.name} </option>)
          })
        }
        </select>
        <h4>전략 만들기</h4>
        전략 이름 : <input placeholder="이름" id="name"/>
        <h4>거래 세팅</h4>

        구매 기준치 : <input placeholder="구매 기준치" id="buyWeight" value={this.state.buyC} onChange={(e) => this.handleCriteria(e, 'buy')}/>
        판매 기준치 : <input placeholder="판매 기준치" id="sellWeight" value={this.state.sellC} onChange={(e) => this.handleCriteria(e, 'sell')}/>

        <h4>지표 세팅</h4>
        <select id="indicator" onChange={(e)=>this.handleIndicator(e)}>
          {
            indicatorList.map((e, i) => {
            return (<option key={i}> {e.indicator} </option>)
          })
        }
        </select>
        <input placeholder={"weight: "+selectedIndicator.weight} id="weight"/>
        {selectedIndicator.period !== undefined && 
          (<input placeholder={"period: "+selectedIndicator.period} id="period"/>)}
        {selectedIndicator.buyIndex !== undefined && 
          (<input placeholder={"buyIndex: "+selectedIndicator.buyIndex} id="buyIndex"/>)}
        {selectedIndicator.sellIndex !== undefined && 
          (<input placeholder={"sellIndex: "+selectedIndicator.sellIndex} id="sellIndex"/>)}
        {selectedIndicator.mul !== undefined && 
          (<input placeholder={"mul: "+selectedIndicator.mul} id="mul"/>)}
        {selectedIndicator.longD !== undefined && 
          (<input placeholder={"longD: "+selectedIndicator.longD} id="longD"/>)}
        {selectedIndicator.shortD !== undefined && 
          (<input placeholder={"shortD: "+selectedIndicator.shortD} id="shortD"/>)}
        {selectedIndicator.mT !== undefined && 
          (<input placeholder={"mT: "+selectedIndicator.mT} id="mT"/>)}
        {selectedIndicator.n !== undefined && 
          (<input placeholder={"n: "+selectedIndicator.n} id="n"/>)}
        {selectedIndicator.m !== undefined && 
          (<input placeholder={"m: "+selectedIndicator.m} id="m"/>)}
        {selectedIndicator.t !== undefined && 
          (<input placeholder={"t: "+selectedIndicator.t} id="t"/>)}
        {selectedIndicator.cor !== undefined && 
          (<input placeholder={"cor: "+selectedIndicator.cor} id="cor"/>)}
        <button disabled={buttonVal} onClick={this.handleSave}>저장</button>

        <h4>저장된 항목</h4>
        {buttonVal === false ? 
          (Object.keys(JSON.parse('{'+jsonString+'}')).map((idc, i) => {
            return (<div key={i}>
              <b>{JSON.parse('{'+jsonString+'}')[idc].indicator}</b><br/>
              <input value={"weight: "+JSON.parse('{'+jsonString+'}')[idc].weight} readOnly/>
              {JSON.parse('{'+jsonString+'}')[idc].period !== undefined && 
                (<input value={"period: "+JSON.parse('{'+jsonString+'}')[idc].period} readOnly/>)}
              {JSON.parse('{'+jsonString+'}')[idc].buyIndex !== undefined && 
                (<input value={"buyIndex: "+JSON.parse('{'+jsonString+'}')[idc].buyIndex} readOnly/>)}
              {JSON.parse('{'+jsonString+'}')[idc].sellIndex !== undefined && 
                (<input value={"sellIndex: "+JSON.parse('{'+jsonString+'}')[idc].sellIndex} readOnly/>)}
              {JSON.parse('{'+jsonString+'}')[idc].mul !== undefined && 
                (<input value={"mul: "+JSON.parse('{'+jsonString+'}')[idc].mul} readOnly/>)}
              {JSON.parse('{'+jsonString+'}')[idc].longD !== undefined && 
                (<input value={"longD: "+JSON.parse('{'+jsonString+'}')[idc].longD} readOnly/>)}
              {JSON.parse('{'+jsonString+'}')[idc].shortD !== undefined && 
                (<input value={"shortD: "+JSON.parse('{'+jsonString+'}')[idc].shortD} readOnly/>)}
              {JSON.parse('{'+jsonString+'}')[idc].mT !== undefined && 
                (<input value={"mT: "+JSON.parse('{'+jsonString+'}')[idc].mT} readOnly/>)}
              {JSON.parse('{'+jsonString+'}')[idc].n !== undefined && 
                (<input value={"n: "+JSON.parse('{'+jsonString+'}')[idc].n} readOnly/>)}
              {JSON.parse('{'+jsonString+'}')[idc].m !== undefined && 
                (<input value={"m: "+JSON.parse('{'+jsonString+'}')[idc].m} readOnly/>)}
              {JSON.parse('{'+jsonString+'}')[idc].t !== undefined && 
                (<input value={"t: "+JSON.parse('{'+jsonString+'}')[idc].t} readOnly/>)}
              {JSON.parse('{'+jsonString+'}')[idc].cor !== undefined && 
                (<input value={"cor: "+JSON.parse('{'+jsonString+'}')[idc].cor} readOnly/>)}<br/>
              {i !== savedCnt-1 &&
                (<button disabled>{expList[i]}</button>)} 
            </div>);
          })) :
          (Object.keys(selectedStrategy.indicatorList).map((idc, i) => {
            return (<div key={i}>
              <b>{selectedStrategy.indicatorList[idc].indicator}</b><br/>
              <input value={"weight: "+selectedStrategy.indicatorList[idc].weight} readOnly/>
              {selectedStrategy.indicatorList[idc].period !== undefined && 
                (<input value={"period: "+selectedStrategy.indicatorList[idc].period} readOnly/>)}
              {selectedStrategy.indicatorList[idc].buyIndex !== undefined && 
                (<input value={"buyIndex: "+selectedStrategy.indicatorList[idc].buyIndex} readOnly/>)}
              {selectedStrategy.indicatorList[idc].sellIndex !== undefined && 
                (<input value={"sellIndex: "+selectedStrategy.indicatorList[idc].sellIndex} readOnly/>)}
              {selectedStrategy.indicatorList[idc].mul !== undefined && 
                (<input value={"mul: "+selectedStrategy.indicatorList[idc].mul} readOnly/>)}
              {selectedStrategy.indicatorList[idc].longD !== undefined && 
                (<input value={"longD: "+selectedStrategy.indicatorList[idc].longD} readOnly/>)}
              {selectedStrategy.indicatorList[idc].shortD !== undefined && 
                (<input value={"shortD: "+selectedStrategy.indicatorList[idc].shortD} readOnly/>)}
              {selectedStrategy.indicatorList[idc].mT !== undefined && 
                (<input value={"mT: "+selectedStrategy.indicatorList[idc].mT} readOnly/>)}
              {selectedStrategy.indicatorList[idc].n !== undefined && 
                (<input value={"n: "+selectedStrategy.indicatorList[idc].n} readOnly/>)}
              {selectedStrategy.indicatorList[idc].m !== undefined && 
                (<input value={"m: "+selectedStrategy.indicatorList[idc].m} readOnly/>)}
              {selectedStrategy.indicatorList[idc].t !== undefined && 
                (<input value={"t: "+selectedStrategy.indicatorList[idc].t} readOnly/>)}
              {selectedStrategy.indicatorList[idc].cor !== undefined && 
                (<input value={"cor: "+selectedStrategy.indicatorList[idc].cor} readOnly/>)}<br/>
              {i !== selectedStrategy.expList.split(',').length &&
                (<button disabled>{selectedStrategy.expList.split(',')[i]}</button>)}
            </div>);
          }))
        }
        <button disabled={buttonVal} onClick={this.handleComplete}>완료</button>
      </div>
    );
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    onStoreStrategy: (value) => dispatch(setStrategy(value))
  }
}

let mapStateToProps = (state) => {
  return {
    strategyList: state.strategy.strategyList
  };
}

Strategy = connect(mapStateToProps, mapDispatchToProps)(Strategy);

export default Strategy;