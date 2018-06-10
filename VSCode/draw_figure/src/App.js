import React, {Component} from 'react';
import './App.css';

class App extends Component {
    state = {
        shape: 'circle'
    }
  
    handleCircle = () => {
        this.setState(
            ({shape}) => ({
                shape: 'circle'
            })
        );
    }
  
    handleSquare = () => {
        this.setState(
            ({shape}) => ({
                shape: 'square'
            })
        );
    }
  
    render() {
        return (
            <div>
            <h1>Draw Figure</h1>
            <div>shape: {this.state.shape}</div>
            <div>
                <button onClick={this.handleCircle}>Circle</button>
                <button onClick={this.handleSquare}>Square</button>
            </div>
            <br></br>
            <div className = {this.state.shape}></div>
            </div>
        );
    }
}

export default App;
