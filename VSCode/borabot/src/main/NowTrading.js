import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Popup from "reactjs-popup";
import { connect } from 'react-redux';

import Alarm from './Alarm';

import './NowTrading.css';
import logBtn from '../img/common/btn_01.png';
import stopBtn from '../img/common/btn_02.png';
import refreshBtn from '../img/common/re_01.png';
import alarmImg from '../img/common/alert_01.png';

class NowTrading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listE: [],
      alarmCount: '0'
    };
  }

  componentDidMount() {    
    axios.get('NowTrading')
    .then( response => {
      if(response.data === 'sessionExpired') this.sessionExpired()
      else {
        this.setState({
          listE: response.data.nowTradingList,
          alarmCount: response.data.alarmCount
        })
      }
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  // 세션 유효성 검증
  sessionExpired = () => {
    alert('세션이 종료되었습니다\n다시 로그인하세요')
    window.location = '/'
  }

  handleAlarm = () => {
    console.log(this.state, this.props)
    axios.post('Alarm')
    .then( response => {
      (response.data === 'sessionExpired')
      ? this.sessionExpired()
      : this.setState({
          alarmCount: '0'
        })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  handleStopbtn = (nt) => {
    // 최종 확인 후 거래 종료 (서버에 거래 정보 전송)
    if(window.confirm(nt.bot_name + " 거래를 종료하시겠습니까?")){
      axios.post( 
        'TradeMain', 
        'status='+false+
        '&botname='+nt.bot_name,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )
      .then( response => {
        if(response.data === 'sessionExpired') this.sessionExpired()
        else{
          this.setState({ alarmCount: '0' })
          alert(nt.bot_name + ' 거래가 종료되었습니다')
        } 
      }) 
      .catch( response => { console.log('err\n'+response); } ); // ERROR
    } else alert("거래를 계속 진행합니다");
  }

  reload = () => {
    axios.get('NowTrading')
    .then( response => {
      (response.data === 'sessionExpired')
      ? this.sessionExpired()
      : this.setState({
          listE: response.data.nowTradingList,
          alarmCount: response.data.alarmCount
        })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
    this.forceUpdate(); // 새로고침
  }

  render() {
    const { alarmCount } = this.state
    
    const logBtnImg  = {
      backgroundImage: `url(${logBtn})`,
    }
    const stopBtnImg  = {
      backgroundImage: `url(${stopBtn})`,
    }
   
    const alarmBg = {
      backgroundImage : `url(${alarmImg})`,
    }
    
    return(
      <div class="ntr-nowTradingTotal">
        <div className = "ntr-nowTradingHead">
        <text className="ntr-nowTradingHeadText">거래 현황</text>
          <Popup
            trigger={<div className = "ntr-nowTradingAlarm" style={alarmBg}> {alarmCount}  </div>}
            modal
            onClose={this.handleAlarm}
            // closeOnDocumentClick
          >{close => (<Alarm close={close}/>)}</Popup>
          <div className="ntr-nowTradingRefresh" onClick={this.reload}><img src = {refreshBtn}/></div>
        </div>
        
        <div className = "NowTrading-elementList">
          {this.state.listE.map((nt) => {
            return (
              <div className = "NowTrading-element" >

                <div className = 'ntr-obj-botname'>{nt.bot_name}</div>
                <div className = 'ntr-obj-coin'>마켓 <text style={{marginLeft : "8px", marginRight:"8px"}}>:</text> <text>{nt.coin}</text> </div>
                <div className = 'ntr-obj-text' >거래소 <text style={{marginLeft : "8px", marginRight:"8px"}}>:</text> {nt.exchange_name}</div>
                <div className = 'ntr-obj-text' >전략 <text style={{marginLeft : "8px", marginRight:"8px"}}>:</text> {nt.strategy_name}</div>
                <div className = 'ntr-obj-text' >거래 간격 <text style={{marginLeft : "8px", marginRight:"8px"}}>:</text>
                  {this.props.intervalList.map((interval) => {
                    return (
                      interval.value === nt.interval
                      && <text>{interval.key}</text>
                    )
                  })}
                </div>
                <div className = 'ntr-obj-text' >종료일 <text style={{marginLeft : "8px", marginRight:"8px"}} >:</text> {nt.end_date.slice(0,-3)}</div>
                <div className = 'ntr-obj-text' >수익률 <text style={{marginLeft : "8px", marginRight:"8px"}}>  :</text> <text className = "ntr-obj-profit">{nt.profit}%</text></div>

                <Link to={{
                  pathname: "/log",
                  bot_name: nt.bot_name,
                  state: { bot_name: nt.bot_name }
                }} id="Sale-stop-btn" className="ntr-obj-logBtn"><img src = {logBtn}/></Link> 
                <div id="Sale-stop-btn" className = "ntr-obj-stopBtn" onClick={() => this.handleStopbtn(nt)}><img src = {stopBtn}/></div>

              </div>);
          })}
        </div>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    intervalList: state.exchange.intervalList
  };
}

NowTrading = connect(mapStateToProps)(NowTrading);

export default NowTrading;