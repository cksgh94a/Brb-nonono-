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
      status:true
    }
  }
  
  componentDidMount() {    
    axios.get('Status')
    .then( response => {
      this.setState({
        email: response.data.email,
        status: response.data.status
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
    
    if(this.state.status){
      // window.location = "/main";
    }
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
