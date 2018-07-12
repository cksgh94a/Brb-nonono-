import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Initial from './components/initial/Initial';
import Main from './components/main/Main';

class App extends Component {

  render() {

    return (
      <div>
        <Switch>
          <Route path="/main" component={Main}/>          
          <Route path="/" component={Initial}/>
        </Switch>
        {/* <Main/> */}
      </div>
    );
  }
}

export default App;

