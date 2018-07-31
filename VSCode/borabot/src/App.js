import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

import Header from './header/Header';
import Initial from './initial/Initial';
import Main from './main/Main';
import Profile from './profile/Profile';
import Board from './board/Board';
import BackTesting from './backTesting/BackTesting';
import Login from './initial/Login';
import Register from './initial/Register';
import Strategy from './strategy/Strategy';
import Log from './log/Log'
import { login, logout } from './actions';

class App extends Component {
  // constructor(){
  //   super();
  //   this.state={
  //     email:'',
  //     status:true // 서버엔 true로 올려야
  //   }
  // }
  
  componentDidMount() {    
    axios.get('Status')
    .then( response => {
      if(response.data.state) this.props.onLogin()
      else this.props.onLogout()
      // this.setState({
      //   email: response.data.email,
      //   status: response.data.status
      // })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR    
  }

  render() {
    console.log(this.props)
    console.log(this.props.login)
    if(this.props.login){
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
                <Route path="/log" component={Log}/>
                <Route path="/register" component={Register}/>
                <Route path="/strategy" component={Strategy}/>
                <Route path="/" component={Main}/>
                <Route path="/" component={Header}/>
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

let mapDispatchToProps = (dispatch) => {
    return {
        onLogin: () => dispatch(login()),
        onLogout: () => dispatch(logout())
    }
}

let mapStateToProps = (state) => {
    return {
        login: state.login
    };
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App;
