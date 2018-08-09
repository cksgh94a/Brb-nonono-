import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Popup from "reactjs-popup";

import Alarm from './Alarm';
import { selectTrading } from '../reducers/sales';

import './NowTrading.css';
import logBtn from '../img/common/btn_01.png';
import stopBtn from '../img/common/btn_02.png';

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
      this.setState({
        listE: response.data.nowTradingList,
        alarmCount: response.data.alarmCount
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  handleAlarm = () => {
    console.log(this.state, this.props)
    axios.post('Alarm')
    .then( response => {
      this.setState({
        alarmCount: '0'
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  handleStopbtn = (nt) => {
    alert(nt.bot_name + " 거래를 중지하시겠습니까?");

    axios.post( 
      'TradeMain', 
      'status='+false+
      '&botname='+nt.bot_name,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
  }

  handleLogbtn = (name) => {
    this.props.onSelectTrading(true, name)
    window.location = "/log";
  }

  reload = () => {
    axios.get('NowTrading')
    .then( response => {
      this.setState({
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
    
    return(
      <div >
        <Popup
          trigger={<button> {alarmCount} </button>}
          modal
          onClose={this.handleAlarm}
          // closeOnDocumentClick
        ><Alarm /></Popup>
        
        <button onClick={this.reload}>새로고침</button>
        <div className = "NowTrading-elementList">
          {this.state.listE.map((nt, i) => {
            return (
              <div className = "NowTrading-element" >

                <div className = 'ntr-obj-botname'>{nt.bot_name}</div>
                <div className = 'ntr-obj-coin'>코인 <text style={{marginLeft : "8px", marginRight:"8px"}}>:</text> <text>{nt.coin}</text> </div>
                <div className = 'ntr-obj-text' >거래소 <text style={{marginLeft : "8px", marginRight:"8px"}}>:</text> {nt.exchange_name}</div>
                <div className = 'ntr-obj-text' >전략 <text style={{marginLeft : "8px", marginRight:"8px"}}>:</text> {nt.strategy_name}</div>
                <div className = 'ntr-obj-text' >종료일 <text style={{marginLeft : "8px", marginRight:"8px"}} >:</text> {nt.end_date}</div>
                <div className = 'ntr-obj-text' >수익률 <text style={{marginLeft : "8px", marginRight:"8px"}}>  :</text> <text className = "ntr-obj-profit">{nt.profit}%</text></div>

                <div id="Sale-stop-btn" className="ntr-obj-logBtn" onClick={() => this.handleLogbtn(nt.bot_name)}><img src = {logBtn}/></div>
                <div id="Sale-stop-btn" className = "ntr-obj-stopBtn" onClick={() => this.handleStopbtn(nt)}><img src = {stopBtn}/></div>

              </div>);
          })}
        </div>
      </div>
    );
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    onSelectTrading: (tf, value) => dispatch(selectTrading(tf, value))
  }
}

NowTrading = connect(undefined, mapDispatchToProps)(NowTrading);

export default NowTrading;