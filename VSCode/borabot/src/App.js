import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import Header from './header/Header';
import Initial from './initial/Initial';
import Main from './main/Main';
import Profile from './profile/Profile';
import Board from './board/Board';
import BackTesting from './backTesting/BackTesting';
import Login from './initial/Login';
import Register from './initial/Register';

class App extends Component {
  constructor(){
    super();
    this.state={
      email:'',
      status:false
    }
  }
  
  componentDidMount() {
    // 이대로 하면 서버 올렸을 때 origin 같아서 cors 안생김 세션 다른거 상관 ㄴㄴ            
    // fetch('http://localhost:8080/BORABOT/NowTrading' // vscode용 + 크롬 cors
    
    axios.get('Status')
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result)
          // this.setState({
          //   email: result.email,
          //   status: result.status
          // })
      }
    )
    
    // window.location = "/main";
  }

  render() {
    console.log(this.state.email);
    console.log(this.state.status);
    if(this.state.status){
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
    
    else{
      return (
        <div>
          <BrowserRouter basename={process.env.REACT_APP_ROUTER_BASE || ''}>
            <div>
              <Header/>
              <Switch>
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
}

export default App;
