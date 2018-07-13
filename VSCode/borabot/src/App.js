import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from './header/Header';
import Initial from './initial/Initial';
import Main from './main/Main';
import Profile from './profile/Profile';
import Board from './board/Board';
import BackTesting from './backTesting/BackTesting';
import Login from './initial/Login';
import Register from './initial/Register';

class App extends Component {
  // constructor(){
  //   super();
  //   this.state={
  //     email:'',
  //     menu:0
  //   }
  // }
  render() {
    // if(this.state.menu==0){
    //   return <div><Header/><Main/></div>
    // }
    // else if(this.state.menu==1){
    //   return <div><Header/><Register/></div>
    // }
    // else if(this.state.menu==2){
    //   return <div><Header/><Login/></div>
    // }
    // else {
    //   return <div><Header/>??</div>
    // }
    return (
      <div>
        <BrowserRouter basename={process.env.REACT_APP_ROUTER_BASE || ''}>
          <div>
            <Header/>
            <Switch>
              <Route path="/main" component={Main}/>
              <Route path="/profile" component={Profile}/>
              <Route path="/backtesting" component={BackTesting}/>
              <Route path="/board" component={Board}/>
              <Route path="/login" component={Login}/>
              <Route path="/register" component={Register}/>
              <Route path="/" component={Initial}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
