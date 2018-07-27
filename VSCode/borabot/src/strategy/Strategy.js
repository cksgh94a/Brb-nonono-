import React, { Component } from 'react';
import axios from 'axios';

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


class Algorithm extends Component {
  constructor(){
    super();
    this.state={
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

      serverStrategyList:[],
      selectedStrategy:'',
      buttonVal: false
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

  // 지표 select box 변화에 따른 현재 선택된 지표와 기본값 state 변화
  handleIndicator = (e) => {
    indicatorList.map((idc, i) => {
      if(idc.indicator === e.target.value){
        this.setState({
          selectedIndicator: idc
        })
      }
    })
    defaultIndicatorList.map((didc, i) => {
      if(didc.indicator === e.target.value){
        this.setState({
          defaultIndicator: didc
        })
      }
    })
  }

  // 설정한 지표 저장 및 리스트, json 저장
  handleSave = (e) => {

    // 현재 설정된 지표 세부 설정 저장
    if(document.getElementById('weight').value === '') this.state.selectedIndicator.weight = this.state.defaultIndicator.weight
    else this.state.selectedIndicator.weight = document.getElementById('weight').value

    if(this.state.selectedIndicator.period === undefined) {}
    else if(document.getElementById('period').value === '') this.state.selectedIndicator.period = this.state.defaultIndicator.period
    else this.state.selectedIndicator.period = document.getElementById('period').value

    if(this.state.selectedIndicator.buyIndex === undefined) {}
    else if(document.getElementById('buyIndex').value === '') this.state.selectedIndicator.buyIndex = this.state.defaultIndicator.buyIndex
    else this.state.selectedIndicator.buyIndex = document.getElementById('buyIndex').value

    if(this.state.selectedIndicator.sellIndex === undefined) {}
    else if(document.getElementById('sellIndex').value === '') this.state.selectedIndicator.sellIndex = this.state.defaultIndicator.sellIndex
    else this.state.selectedIndicator.sellIndex = document.getElementById('sellIndex').value

    if(this.state.selectedIndicator.mul === undefined) {}
    else if(document.getElementById('mul').value === '') this.state.selectedIndicator.mul = this.state.defaultIndicator.mul
    else this.state.selectedIndicator.mul = document.getElementById('mul').value

    if(this.state.selectedIndicator.longD === undefined) {}
    else if(document.getElementById('longD').value === '') this.state.selectedIndicator.longD = this.state.defaultIndicator.longD
    else this.state.selectedIndicator.longD = document.getElementById('longD').value

    if(this.state.selectedIndicator.shortD === undefined) {}
    else if(document.getElementById('shortD').value === '') this.state.selectedIndicator.shortD = this.state.defaultIndicator.shortD
    else this.state.selectedIndicator.shortD = document.getElementById('shortD').value

    if(this.state.selectedIndicator.mT === undefined) {}
    else if(document.getElementById('mT').value === '') this.state.selectedIndicator.mT = this.state.defaultIndicator.mT
    else this.state.selectedIndicator.mT = document.getElementById('mT').value

    if(this.state.selectedIndicator.n === undefined) {}
    else if(document.getElementById('n').value === '') this.state.selectedIndicator.n = this.state.defaultIndicator.n
    else this.state.selectedIndicator.n = document.getElementById('n').value

    if(this.state.selectedIndicator.m === undefined) {}
    else if(document.getElementById('m').value === '') this.state.selectedIndicator.m = this.state.defaultIndicator.m
    else this.state.selectedIndicator.m = document.getElementById('m').value

    if(this.state.selectedIndicator.t === undefined) {}
    else if(document.getElementById('t').value === '') this.state.selectedIndicator.t = this.state.defaultIndicator.t
    else this.state.selectedIndicator.t = document.getElementById('t').value

    if(this.state.selectedIndicator.cor === undefined) {}
    else if(document.getElementById('cor').value === '') this.state.selectedIndicator.cor = this.state.defaultIndicator.cor
    else this.state.selectedIndicator.cor = document.getElementById('cor').value

    var tempJson = this.state.jsonString

    if(this.state.savedCnt === 0) {
      this.setState({
        buttonVal: false,
        indicatorList: this.state.indicatorList.concat(this.state.selectedIndicator),
        savedCnt: this.state.savedCnt + 1,
        jsonString: '"'+this.state.savedCnt+'":'+JSON.stringify(this.state.selectedIndicator)
      })
    } else {
      this.setState({
        name: document.getElementById('name').value,
        indicatorList: this.state.indicatorList.concat(this.state.selectedIndicator),
        expList: this.state.expList.concat(this.state.calculate),
        savedCnt: this.state.savedCnt + 1,
        jsonString: tempJson+',"'+this.state.savedCnt+'":'+JSON.stringify(this.state.selectedIndicator)
      })
    }
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
      this.state.serverStrategyList.map((s) => {
        if(e.target.value === s.name) {
          this.setState({
            selectedStrategy: JSON.parse(s.data)
          })
        }
      })
    }
  }
  
  handleComplete = () => {
    var send = '{"indicatorList":{'+this.state.jsonString+'},"buyCriteria":'+this.state.buyC+',"sellCriteria":'+this.state.sellC+',"expList":"'+this.state.expList+'"}'

    // DB에 새로운 전략 저장
    axios.post(
      'Strategy', 
      'name='+this.state.name+'&data='+send, 
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
    .then( response => {
      this.setState({
        serverStrategyList: response.data
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  render() {
    return (
      <div>
        <h4>불러오기</h4>
        <select id="serverStrategy" onChange={(e)=>this.handleLoad(e)}>
          <option>새로 만들기</option>
          {
            this.state.serverStrategyList.map((e, i) => {
            return (<option key={i}> {e.name} </option>)
          })
        }
        </select>
        <h4>전략 만들기</h4>
        전략 이름 : <input placeholder="이름" id="name"/>
        <h4>거래 세팅</h4>

        구매 기준치 : <input placeholder="구매 기준치" id="buyWeight"/>
        판매 기준치 : <input placeholder="판매 기준치" id="sellWeight"/>

        <h4>지표 세팅</h4>
        <select id="indicator" onChange={(e)=>this.handleIndicator(e)}>
          {
            indicatorList.map((e, i) => {
            return (<option key={i}> {e.indicator} </option>)
          })
        }
        </select>
        <input placeholder={"weight: "+this.state.selectedIndicator.weight} id="weight"/>
        {this.state.selectedIndicator.period !== undefined && 
          (<input placeholder={"period: "+this.state.selectedIndicator.period} id="period"/>)}
        {this.state.selectedIndicator.buyIndex !== undefined && 
          (<input placeholder={"buyIndex: "+this.state.selectedIndicator.buyIndex} id="buyIndex"/>)}
        {this.state.selectedIndicator.sellIndex !== undefined && 
          (<input placeholder={"sellIndex: "+this.state.selectedIndicator.sellIndex} id="sellIndex"/>)}
        {this.state.selectedIndicator.mul !== undefined && 
          (<input placeholder={"mul: "+this.state.selectedIndicator.mul} id="mul"/>)}
        {this.state.selectedIndicator.longD !== undefined && 
          (<input placeholder={"longD: "+this.state.selectedIndicator.longD} id="longD"/>)}
        {this.state.selectedIndicator.shortD !== undefined && 
          (<input placeholder={"shortD: "+this.state.selectedIndicator.shortD} id="shortD"/>)}
        {this.state.selectedIndicator.mT !== undefined && 
          (<input placeholder={"mT: "+this.state.selectedIndicator.mT} id="mT"/>)}
        {this.state.selectedIndicator.n !== undefined && 
          (<input placeholder={"n: "+this.state.selectedIndicator.n} id="n"/>)}
        {this.state.selectedIndicator.m !== undefined && 
          (<input placeholder={"m: "+this.state.selectedIndicator.m} id="m"/>)}
        {this.state.selectedIndicator.t !== undefined && 
          (<input placeholder={"t: "+this.state.selectedIndicator.t} id="t"/>)}
        {this.state.selectedIndicator.cor !== undefined && 
          (<input placeholder={"cor: "+this.state.selectedIndicator.cor} id="cor"/>)}
        <button disabled={this.state.buttonVal} onClick={this.handleSave}>저장</button>

        <h4>저장된 항목</h4>
        {this.state.buttonVal === false ? 
          (Object.keys(JSON.parse('{'+this.state.jsonString+'}')).map((idc, i) => {
            return (<div key={i}>
              <b>{JSON.parse('{'+this.state.jsonString+'}')[idc].indicator}</b><br/>
              <input value={"weight: "+JSON.parse('{'+this.state.jsonString+'}')[idc].weight} readOnly/>
              {JSON.parse('{'+this.state.jsonString+'}')[idc].period !== undefined && 
                (<input value={"period: "+JSON.parse('{'+this.state.jsonString+'}')[idc].period} readOnly/>)}
              {JSON.parse('{'+this.state.jsonString+'}')[idc].buyIndex !== undefined && 
                (<input value={"buyIndex: "+JSON.parse('{'+this.state.jsonString+'}')[idc].buyIndex} readOnly/>)}
              {JSON.parse('{'+this.state.jsonString+'}')[idc].sellIndex !== undefined && 
                (<input value={"sellIndex: "+JSON.parse('{'+this.state.jsonString+'}')[idc].sellIndex} readOnly/>)}
              {JSON.parse('{'+this.state.jsonString+'}')[idc].mul !== undefined && 
                (<input value={"mul: "+JSON.parse('{'+this.state.jsonString+'}')[idc].mul} readOnly/>)}
              {JSON.parse('{'+this.state.jsonString+'}')[idc].longD !== undefined && 
                (<input value={"longD: "+JSON.parse('{'+this.state.jsonString+'}')[idc].longD} readOnly/>)}
              {JSON.parse('{'+this.state.jsonString+'}')[idc].shortD !== undefined && 
                (<input value={"shortD: "+JSON.parse('{'+this.state.jsonString+'}')[idc].shortD} readOnly/>)}
              {JSON.parse('{'+this.state.jsonString+'}')[idc].mT !== undefined && 
                (<input value={"mT: "+JSON.parse('{'+this.state.jsonString+'}')[idc].mT} readOnly/>)}
              {JSON.parse('{'+this.state.jsonString+'}')[idc].n !== undefined && 
                (<input value={"n: "+JSON.parse('{'+this.state.jsonString+'}')[idc].n} readOnly/>)}
              {JSON.parse('{'+this.state.jsonString+'}')[idc].m !== undefined && 
                (<input value={"m: "+JSON.parse('{'+this.state.jsonString+'}')[idc].m} readOnly/>)}
              {JSON.parse('{'+this.state.jsonString+'}')[idc].t !== undefined && 
                (<input value={"t: "+JSON.parse('{'+this.state.jsonString+'}')[idc].t} readOnly/>)}
              {JSON.parse('{'+this.state.jsonString+'}')[idc].cor !== undefined && 
                (<input value={"cor: "+JSON.parse('{'+this.state.jsonString+'}')[idc].cor} readOnly/>)}<br/>
              {i !== this.state.savedCnt-1 &&
                (<button disabled>{this.state.expList[i]}</button>)} 
            </div>);
          })) :
          (Object.keys(this.state.selectedStrategy.indicatorList).map((idc, i) => {
            return (<div key={i}>
              <b>{this.state.selectedStrategy.indicatorList[idc].indicator}</b><br/>
              <input value={"weight: "+this.state.selectedStrategy.indicatorList[idc].weight} readOnly/>
              {this.state.selectedStrategy.indicatorList[idc].period !== undefined && 
                (<input value={"period: "+this.state.selectedStrategy.indicatorList[idc].period} readOnly/>)}
              {this.state.selectedStrategy.indicatorList[idc].buyIndex !== undefined && 
                (<input value={"buyIndex: "+this.state.selectedStrategy.indicatorList[idc].buyIndex} readOnly/>)}
              {this.state.selectedStrategy.indicatorList[idc].sellIndex !== undefined && 
                (<input value={"sellIndex: "+this.state.selectedStrategy.indicatorList[idc].sellIndex} readOnly/>)}
              {this.state.selectedStrategy.indicatorList[idc].mul !== undefined && 
                (<input value={"mul: "+this.state.selectedStrategy.indicatorList[idc].mul} readOnly/>)}
              {this.state.selectedStrategy.indicatorList[idc].longD !== undefined && 
                (<input value={"longD: "+this.state.selectedStrategy.indicatorList[idc].longD} readOnly/>)}
              {this.state.selectedStrategy.indicatorList[idc].shortD !== undefined && 
                (<input value={"shortD: "+this.state.selectedStrategy.indicatorList[idc].shortD} readOnly/>)}
              {this.state.selectedStrategy.indicatorList[idc].mT !== undefined && 
                (<input value={"mT: "+this.state.selectedStrategy.indicatorList[idc].mT} readOnly/>)}
              {this.state.selectedStrategy.indicatorList[idc].n !== undefined && 
                (<input value={"n: "+this.state.selectedStrategy.indicatorList[idc].n} readOnly/>)}
              {this.state.selectedStrategy.indicatorList[idc].m !== undefined && 
                (<input value={"m: "+this.state.selectedStrategy.indicatorList[idc].m} readOnly/>)}
              {this.state.selectedStrategy.indicatorList[idc].t !== undefined && 
                (<input value={"t: "+this.state.selectedStrategy.indicatorList[idc].t} readOnly/>)}
              {this.state.selectedStrategy.indicatorList[idc].cor !== undefined && 
                (<input value={"cor: "+this.state.selectedStrategy.indicatorList[idc].cor} readOnly/>)}<br/>
              {i !== this.state.selectedStrategy.expList.split(',').length &&
                (<button disabled>{this.state.selectedStrategy.expList.split(',')[i]}</button>)}
            </div>);
          }))
        }
        <button disabled={this.state.buttonVal} onClick={this.handleComplete}>완료</button>
      </div>
    );
  }
}

export default Algorithm;