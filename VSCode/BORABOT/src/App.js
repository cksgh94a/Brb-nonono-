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
      id : "cksgh94a",
      listJ: new Array()
    };

  }

  render() {

    return (
      <div>
      <div className="App">
      <div className="wrapper">
        <div className="one"><NowTrading id = {this.state.id}/></div>
        <div className="three"><ChartSelect/></div>
        <div className="four"><WalletInfo/></div>
        <div className="five"><Sales id = {this.state.id} /></div>
      </div>
      </div>
      <form action="DoAuth" method="POST">회원가입<br/> 
        Username: <input type="text" name="email"/><br /> Password:
        <input type="password" name="password"/><br /> <input
          type="submit" value="회원가입"/>
      </form><br/><br/>
      <form action="DoLogin" method="POST">Login<br/>
        Username: <input type="text" name="email"/><br /> Password:
        <input type="password" name="password"/><br /> <input
          type="submit" value="로그인"/>
      </form>
      
      </div>
    );
  }
}

export default App;

