import React, { Component } from 'react';
import './Sales.css';

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

const unitList = [
  "5m", "10m", "15m", "30m", "1h", "6h", "1d", "1w", "1m", "1y"
]

class Sales extends Component {

  handleStartbtn = () => {
    let SL_coinSelectbox = document.getElementById("SL_coinSelectbox");
    SL_coinSelectbox = SL_coinSelectbox.options[SL_coinSelectbox.selectedIndex].text;
    let SL_exchangeSelectbox = document.getElementById("SL_exchangeSelectbox");
    SL_exchangeSelectbox = SL_exchangeSelectbox.options[SL_exchangeSelectbox.selectedIndex].text;
    let SL_strategySelectbox = document.getElementById("SL_strategySelectbox");
    SL_strategySelectbox = SL_strategySelectbox.options[SL_strategySelectbox.selectedIndex].text;
    let SL_priceInputbox = document.getElementById("SL_priceInputbox");
    //SL_priceInputbox = SL_priceInputbox.text;
    let SL_deadlineInputbox = document.getElementById("SL_deadlineInputbox");
    //SL_deadlineInputbox = SL_deadlineInputbox.text;

    let string = SL_coinSelectbox + '\n' + SL_exchangeSelectbox + '\n' + SL_strategySelectbox + '\n' + SL_priceInputbox.value + '\n' + SL_deadlineInputbox.value +  '\n' + "이 맞습니까?";

    alert(string);
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
          <button id="Sale-detail-btn" style={{ margin: '3px' }}>
            상세 내역
                </button>
          <br></br>
          <button id="Sale-start-btn" onClick={this.handleStartbtn} style={{ margin: '3px' }}>
            거래 시작
                </button>
        </div>
      </div>
    );
  }

}

export default Sales;