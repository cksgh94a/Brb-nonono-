import React, { Component } from 'react';
import './Sales.css';

const botHandle = new WebSocket("ws://localhost:8080/wsSales/bothandle");
const mainHandle = new WebSocket("ws://localhost:8080/wsSales/mainhandle");
// const botHandle = new WebSocket("ws://45.120.65.65/wsSales/bothandle");
const exchangeList = [
  {
    name: "BITTREX",
    //link?
  },
  {
    name: "BITHUMB"
  },
  {
    name: "BINANCE"
  },
  {
    name: "KORBIT"
  },
  {
    name: "COINONE"
  }
]

const coinList = [
  {
    name: "ETH",
    img: "eth_img.jpg",
    link_whitepaper: "https://whitepaperbtc.com"
  },
  {
    name: "BTC",
    img: "btc_img.jpg",
    link_whitepaper: "https://whitepaperbtc.com"
  },
  {
    name: "BTG",
    img: "btg_img.jpg",
    link_whitepaper: "https://whitepaperbtc.com"
  },
  {
    name: "XRP",
    img: "xrp_img.jpg",
    link_whitepaper: "https://whitepaperbtc.com"
  },
  {
    name: "EOS",
    img: "eos_img.jpg",
    link_whitepaper: "https://whitepaperbtc.com"
  },
  {
    name: "LTC",
    img: "ltc_img.jpg",
    link_whitepaper: "https://whitepaperbtc.com"
  },
  {
    name: "DOG",
    img: "dog_img.jpg",
    link_whitepaper: "https://whitepaperbtc.com"
  },
  {
    name: "ETC",
    img: "etc_img.jpg",
    link_whitepaper: "https://whitepaperbtc.com"
  },
  {
    name: "QTUM",
    img: "qtum_img.jpg",
    link_whitepaper: "https://whitepaperbtc.com"
  }
]

const unitList = [
  "5m", "10m", "15m", "30m", "1h", "6h", "1d", "1w", "1m", "1y"
]

class Sales extends Component {

  handleStartbtn = () => {
    let SL_coinSelectbox = document.getElementById("SL_coinSelectbox");
    var sCoin = SL_coinSelectbox.options[SL_coinSelectbox.selectedIndex].text;
    let SL_exchangeSelectbox = document.getElementById("SL_exchangeSelectbox");
    var sExchange = SL_exchangeSelectbox.options[SL_exchangeSelectbox.selectedIndex].text;
    let SL_strategySelectbox = document.getElementById("SL_strategySelectbox");
    var sStrategy = SL_strategySelectbox.options[SL_strategySelectbox.selectedIndex].text;
    let SL_priceInputbox = document.getElementById("SL_priceInputbox");
    var sPrice = SL_priceInputbox.value;
    let SL_deadlineInputbox = document.getElementById("SL_deadlineInputbox");
    var sDeadline = SL_deadlineInputbox.value;

    var json1 = {"status" : true, "coin" : sCoin, "exchange" : sExchange, "strategy" : sStrategy, "price" : sPrice, "deadline": sDeadline};
    var trasJson =  JSON.stringify(json1);

    let alertMsg = sCoin + '\n' + sExchange + '\n' + sStrategy + '\n' + sPrice + '\n' + sDeadline +  '\n' + "이 맞습니까?";

    alert(alertMsg);

    //웹소켓으로 textMessage객체의 값을 보낸다.
    botHandle.send(trasJson);
    mainHandle.send(JSON.stringify(true));
    console.log(trasJson + '전송');
  }

  handleStopbtn = () => {
    alert("거래를 중지하시겠습니까?");
    mainHandle.send(JSON.stringify(false));
  }

  render() {
    return (
      <div>
        <h4 className="Sales-color">
          Sales configuration
                </h4>

        <div>
          <select className="Sales-box" id="SL_coinSelectbox" size='1'>
            {coinList.map((coin, i) => {
              return (<option key={i}> {coin.name} </option>)
            })}
          </select>
        </div>

        <div>
          <select className="Sales-box" id="SL_exchangeSelectbox" size='1'>
            {exchangeList.map((exchange, i) => {
              return (<option key={i}> {exchange.name} </option>)
            })
            }
          </select>
        </div>

        <div>
          <select className="Sales-box" id="SL_strategySelectbox" size='1'>
            <option> 불린저밴드 </option>
            <option> Momentum </option>
            <option> 각종여러가지 </option>
            <option> 골든크로스  </option>
            <option> 돈잘버는법  </option>
          </select>
        </div>

        <div>
          <input className="Sales-input" id="SL_priceInputbox" placeholder="금액" ></input>
        </div>
        <div>
          <input className="Sales-input" id="SL_deadlineInputbox" placeholder="마감 기한" ></input>
        </div>


        <div className="Sales-start-btn" id="Sale-start">
          <button id="Sale-start-btn" onClick={this.handleStartbtn} style={{ margin: '3px' }}>
            거래 시작
          </button>
          <br></br>
          <button id="Sale-stop-btn" onClick={this.handleStopbtn} style={{ margin: '3px' }}>
            거래 종료
          </button>
        </div>
      </div>
    );
  }

}

export default Sales;