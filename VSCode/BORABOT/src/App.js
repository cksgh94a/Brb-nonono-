import React, { Component } from 'react';
import './App.css';
import ChartSelect from './components/ChartSelect';
import Sales from './components/Sales';
import NowTrading from './components/NowTrading';
import WalletInfo from './components/WalletInfo';
import WalletInfoChild from './components/WalletInfoChild';

import HeaderContainer from './containers/Base/HeaderContainer';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from './redux/modules/user';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div>
          <HeaderContainer/>
        </div>
        <div className="wrapper">
          <div className="one"><NowTrading id = "cksgh94a"/></div>
          <div className="three"><ChartSelect/></div>
          <div className="four"><WalletInfo/></div>
          <div className="four_child"><WalletInfoChild/></div>
          <div className="five"><Sales id = "cksgh94a"/></div>
        </div>
      </div>
    );
  }
}

export default connect(null, (dispatch) => ({
    UserActions: bindActionCreators(userActions, dispatch)
  })
)(App);
