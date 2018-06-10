import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ChartSelect from './components/ChartSelect';
import Sales from './components/Sales';
import NowTrading from './components/NowTrading';
import Accounts from './components/Accounts';
import WalletInfo from './components/WalletInfo';
import Five from './components/Five';

class App extends Component {

  render() {

    return (
      <div className="App">
      <header className="App-header">
          TASS Draft
        </header>
        <div className="wrapper">
          <div className="one"><NowTrading/></div>
          <div className="two"><Sales/></div>
          <div className="three"><ChartSelect/></div>
          <div className="four"><WalletInfo/></div>
          <div className="five"></div>
          </div>
        
        <div>
          bottom<br/>
        </div>

      </div>
    );
  }
}

export default App;

