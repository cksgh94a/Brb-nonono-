import React, { Component } from 'react';
import './NowTrading.css';

const botStop = new WebSocket("ws://45.120.65.65/wsSales/botstop");
class NTComp extends Component {

    handleStopbtn = () => {
      alert(this.props.name + " 거래를 중지하시겠습니까?");
      var jsonStop = {"name" : this.props.name, "status" : false};
      botStop.send(JSON.stringify(jsonStop));
    }
    
    render() {
        return(
            <div >
                <div className = "NowTrading-element" >
                    <b>{this.props.name}</b>)&nbsp;&nbsp;{this.props.date}
                    <br></br>
                    {this.props.coin} &nbsp; / &nbsp;{this.props.exchange}
                    <br></br>
                    {this.props.profit}%&nbsp; / &nbsp;{this.props.strategy}
                    <button id="Sale-stop-btn" onClick={this.handleStopbtn} >
                    거래 종료
                    </button>
                </div>
            </div>
        );
    }

}

export default NTComp;