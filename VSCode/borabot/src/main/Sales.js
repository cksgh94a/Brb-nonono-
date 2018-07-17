import React, { Component } from 'react';
import axios from 'axios';

import './Sales.css';

const exchangeList = ["bithumb", "bittrex", "binance", "korbit", "coinone"]
const coinList = ["btc", "eth", "btg", "xrp", "eos", "ltc", "dog", "etc", "qtum"]

class Sales extends Component {
  handleStartbtn = () => {
    // var sName = document.getElementById("SL_nameInputbox").value;
    // var sPrice = document.getElementById("SL_priceInputbox").value;
    // var sDeadline = document.getElementById("SL_deadlineInputbox").value;

    // let SL_coinSelectbox = document.getElementById("SL_coinSelectbox");
    // var sCoin = SL_coinSelectbox.options[SL_coinSelectbox.selectedIndex].text;

    // let SL_exchangeSelectbox = document.getElementById("SL_exchangeSelectbox");
    // var sExchange = SL_exchangeSelectbox.options[SL_exchangeSelectbox.selectedIndex].text;

    // let SL_strategySelectbox = document.getElementById("SL_strategySelectbox");
    // var sStrategy = SL_strategySelectbox.options[SL_strategySelectbox.selectedIndex].text;
    
    // var jsonStart = {
    //   "id" : this.props.id,
    //   "name" : document.getElementById("SL_nameInputbox").value,
    //   "status" : true,
    //   "coin" : sCoin,
    //   "exchange" : sExchange,
    //   "strategy" : sStrategy,
    //   "price" : sPrice,
    //   "startDate" : new Date(),
    //   "period": sDeadline
    // };
    // 웹소켓으로 textMessage객체의 값을 보낸다.
    // mainHandle.send(JSON.stringify(jsonStart));

    let alertMsg = document.getElementById('botname').value + '\n' + 
    document.getElementById('coin').value + '\n' + 
    document.getElementById('exchange').value + '\n' + 
    document.getElementById('asset').value + '\n' + 
    document.getElementById('strategy').value + '\n' + 
    document.getElementById('period').value + '\n' + 
     +  '\n이 맞습니까?';

    alert(alertMsg);

    axios.post( 
      'TradeMain', 
      'status='+true+
      '&botname='+document.getElementById('botname').value+
      '&coin='+document.getElementById('coin').value+
      '&exchange='+document.getElementById('exchange').value+
      '&asset='+document.getElementById('asset').value+
      '&strategy='+document.getElementById('strategy').value+
      '&period='+document.getElementById('period').value,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
  }

  render() {
    return (
      <div>        
        <h4 className="Sales-color">Sales configuration</h4>
        <input className="Sales-input" placeholder="이름" id="botname"/><br/>
        <select className="Sales-box" size='1' id="coin">
          {coinList.map((coin, i) => {
            return (<option key={i}> {coin} </option>)
          })}
        </select><br/>
        <select className="Sales-box" size='1' id="exchange">
          {exchangeList.map((exchange, i) => {
            return (<option key={i}> {exchange} </option>)
          })
          }
        </select><br/>
        <select className="Sales-box" size='1' id="strategy">
          <option>bollingerPatternNaked</option>
          <option>Bollingertrade</option>
          <option>trendFollowing</option>
          <option>patterNakedTrade</option>
        </select><br/>
        <input className="Sales-input" placeholder="금액 (원)" id="asset"/><br/>
        <input className="Sales-input" placeholder="거래 기간 (일)" id="period"/><br/>
        <button onClick={this.handleStartbtn}>거래 시작</button>
      </div>
    );
  }

}

export default Sales;