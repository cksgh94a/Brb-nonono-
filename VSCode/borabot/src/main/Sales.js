import React, { Component } from 'react';
import axios from 'axios';

import './Sales.css';

const exchangeList = ["bithumb", "bittrex", "binance", "korbit", "coinone"]
const coinList = ["btc", "eth", "btg", "xrp", "eos", "ltc", "dog", "etc", "qtum"]

class Sales extends Component {
  constructor(props) {
    super(props);
    this.state={
      status:true,
      botname:'',
      coin:'',
      exchange:'',
      asset:'',
      strategy:'',
      period:'',
    }
  }

  handleChange = (e) => {  
    if(e.target.name === "botname"){
      this.setState({
        botname: e.target.value
      })
    }
    else if(e.target.name === "coin"){
      this.setState({
        coin: e.target.value
      })
    }
    else if(e.target.name === "exchange"){
      this.setState({
        exchange: e.target.value
      })
    }
    else if(e.target.name === "asset"){
      this.setState({
        asset: e.target.value
      })
    }
    else if(e.target.name === "strategy"){
      this.setState({
        strategy: e.target.value
      })
    }
    else if(e.target.name === "period"){
      this.setState({
        period: e.target.value
      })
    }
  }  

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

    let alertMsg = this.state.botname + '\n' + this.state.exchange + '\n' + this.state.strategy + '\n' + this.state.asset + '\n' + this.state.period +  '\n이 맞습니까?';

    alert(alertMsg);

    axios.post( 
      'TradeMain', 
      'status='+true+
      '&botname='+this.state.botname+
      '&coin='+this.state.coin+
      '&exchange='+this.state.exchange+
      '&asset='+this.state.asset+
      '&strategy='+this.state.status+
      '&period='+this.state.period,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
  }

  render() {
    return (
      <div>        
        <h4 className="Sales-color">Sales configuration</h4>
        <input className="Sales-input" placeholder="이름" name="botname" onChange={(e)=>this.handleChange(e)}/><br/>
        <select className="Sales-box" size='1' name="coin" onChange={(e)=>this.handleChange(e)}>
          {coinList.map((coin, i) => {
            return (<option key={i}> {coin} </option>)
          })}
        </select><br/>
        <select className="Sales-box" size='1' name="exchange" onChange={(e)=>this.handleChange(e)}>
          {exchangeList.map((exchange, i) => {
            return (<option key={i}> {exchange} </option>)
          })
          }
        </select><br/>
        <select className="Sales-box" size='1' name="strategy" onChange={(e)=>this.handleChange(e)}>
          <option>bollingerPatternNaked</option>
          <option>Bollingertrade</option>
          <option>trendFollowing</option>
          <option>patterNakedTrade</option>
        </select><br/>
        <input className="Sales-input" placeholder="금액 (원)" name="asset" onChange={(e)=>this.handleChange(e)}/><br/>
        <input className="Sales-input" placeholder="거래 기간 (일)" name="period" onChange={(e)=>this.handleChange(e)}/><br/>
        <button onClick={this.handleStartbtn}>거래 시작</button>
      </div>
    );
  }

}

export default Sales;