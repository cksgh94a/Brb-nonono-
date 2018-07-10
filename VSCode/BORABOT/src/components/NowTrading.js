import React, { Component } from 'react';
import './NowTrading.css';
import TradingElement from './TradingElement';
import axios from 'axios';


// const ntHandle = new WebSocket("ws://localhost:8080/Auth/nthandle");
// const ntHandle = new WebSocket("ws://localhost:8080/BORABOT/nthandle");
const ntHandle = new WebSocket("ws://45.120.65.65/BORABOT/nthandle");

class NowTrading extends Component {
    constructor(props) {
       super(props);

        this.state = {
            listJ: new Array()
        };
    
        // ntHandle.onopen = (event) => {
        //     ntHandle.send(this.props.id)
        // }
        
        // ntHandle.onmessage = (event) => {
        //     if(event.data != "null"){
        //         this.setState(
        //             {listJ: JSON.parse(event.data)});
        //         }
        // }

        console.log("dkdkdkdk")
        axios.get('/SendNowTrading')
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error){
            console.log(error);
        });
    }

    render() {
        return(
            <div >
                <div className = "NowTrading-elementList">
                    <div>
                    {this.state.listJ.map((nt, i) => {
                        return (<TradingElement id = {this.props.id} name = {nt.name} endDate = {nt.endDate} 
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