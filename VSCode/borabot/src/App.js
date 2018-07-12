import React, { Component } from 'react';
import './App.css';
import ChartSelect from './components/main/ChartSelect';
import Sales from './components/main/Sales';
import NowTrading from './components/main/NowTrading';
import WalletInfo from './components/main/WalletInfo';
import Login from './components/initial/Login';

class App extends Component {

  render() {

    return (
      <div>
      <div className="App">
      <div className="wrapper">
        <div className="one"><NowTrading/></div>
        <div className="three"><ChartSelect/></div>
        <div className="four"><WalletInfo/></div>
        <div className="five"><Sales/></div>
      </div>
      </div>
      <Login/>      
      </div>
    );
  }
}

export default App;

