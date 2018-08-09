import React, { Component } from 'react';

import ChartSelect from './ChartSelect';
import Sales from './Sales';
import NowTrading from './NowTrading';
import WalletInfo from './WalletInfo';
import CoinRecommend from './CoinRecommend';

import './Main.css';

class Main extends Component {
  render() {
    return (
      <div className="App">
        <div className = 'bg-recommend'><CoinRecommend/></div>
        <div className = 'bg-nowTrading'><NowTrading className = 'three-trading-obj'/></div>
        <div className = 'bg-chart'><ChartSelect/></div>
        <div className = 'bg-wallet'><WalletInfo/></div>
        <div className = 'bg-transaction'><Sales/></div>
      </div>
    );
  }
}

export default Main;

