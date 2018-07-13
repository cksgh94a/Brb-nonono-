import React, { Component } from 'react';
import {
    BrowserRouter,
    Link,
    Route,
    Switch
} from 'react-router-dom';

import Initial from './components/initial/Initial';
import Main from './components/main/Main';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <BrowserRouter basename={process.env.REACT_APP_ROUTER_BASE || ''}>
          <div>
            <ul className="nav">
              <li><Link to="/">Init</Link></li>
              <li><Link to="/main">Main</Link></li>
            </ul>
            <Switch>
              <Route path="/main" component={Main}/>
              <Route path="/" component={Initial}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
