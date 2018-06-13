import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import ChartSelect from './components/ChartSelect';
import Sales from './components/Sales';
import NowTrading from './components/NowTrading';
// import Accounts from './components/Accounts';
import WalletInfo from './components/WalletInfo';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      id : "a"
    };

  }

  render() {

    return (
      <div className="App">
      <header className="App-header">
          TASS Draft
        </header>
        <div className="wrapper">
          <div className="one"><NowTrading id = {this.state.id}/></div>
          <div className="three"><ChartSelect/></div>
          <div className="four"><WalletInfo/></div>
          <div className="five"><Sales id = {this.state.id}/></div>
          </div>
        
        <div>
          bottom<br/>
        </div>

      </div>
    );
  }
}

export default App;

