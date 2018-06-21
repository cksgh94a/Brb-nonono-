import React, { Component } from 'react';
import './NowTrading.css';
import TradingElement from './TradingElement';


// const ntHandle = new WebSocket("ws://localhost:8080/wsSales/nthandle");
const ntHandle = new WebSocket("ws://45.120.65.65/wsSales/nthandle");

class NowTrading extends Component {
    constructor(props) {
       super(props);

        this.state = {
            listJ: new Array()
        };
    
        ntHandle.onopen = (event) => {
            ntHandle.send(this.props.id)
        }
        
        ntHandle.onmessage = (event) => {
            if(event.data != "null"){
                this.setState(
                    {listJ: JSON.parse(event.data)});
                }
        }
    }
    
    render() {
        return(
            <div >
                <div className = "NowTrading-elementList">
                    <div>
                    {this.state.listJ.map((nt, i) => {
                        return (<TradingElement id = {this.props.id} name = {nt.name} resDate = {nt.residualDate} 
                            coin = {nt.coin} exchange = {nt.exchange}
                            profit = {nt.profit} strategy = {nt.strategy} key = {nt.i}
                                 />);
                    })}
                    </div>
                </div>
            </div>
        );
    }

}

export default NowTrading;