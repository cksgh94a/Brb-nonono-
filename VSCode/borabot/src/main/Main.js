import React, { Component } from 'react';

import ChartSelect from './ChartSelect';
import Sales from './Sales';
import NowTrading from './NowTrading';
import WalletInfo from './WalletInfo';

import './Main.css';

class Main extends Component {
  render() {
    return (
      <div className="App">
        <div className="wrapper">
          <div className = 'bg-recommend'>코인 추천</div>
          <div className = 'bg-two'>거래 현황 </div>
          <div className = 'bg-nowTrading'><NowTrading className = 'three-trading-obj'/></div>
          <div className = 'bg-chart'><ChartSelect/></div>
          <div className = 'bg-wallet'><WalletInfo/></div>
          {/* <div className="four"><WalletInfo/></div> */}
          <div className = 'bg-transaction'><Sales/></div>
        </div>
      </div>
      // <div className="App">
      //   <div className="wrapper">
      //     <div className="one"><NowTrading/></div>
      //     <div className="three"><ChartSelect/></div>
      //     {/* <div className="four"><WalletInfo/></div> */}
      //     <div className="five"><Sales/></div>
      //   </div>
      // </div>
    );
  }
}

export default Main;

