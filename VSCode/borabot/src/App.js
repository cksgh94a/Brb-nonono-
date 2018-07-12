import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Initial from './components/initial/Initial';
import Main from './components/main/Main';

class App extends Component {

  render() {

    return (
      <div>
        <Route exact path="/" component={Initial}/>
        <Route path="/main" component={Main}/>
        {/* <Main/> */}
      </div>
    );
  }
}

export default App;

