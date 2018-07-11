import React, { Component } from 'react';
import './NowTrading.css';
import TradingElement from './TradingElement';
// import fetchJsonp from 'fetch-jsonp';
// import axios from 'axios';


// const ntHandle = new WebSocket("ws://localhost:8080/Auth/nthandle");
// const ntHandle = new WebSocket("ws://localhost:8080/BORABOT/nthandle");
// const ntHandle = new WebSocket("ws://45.120.65.65/BORABOT/nthandle");

class NowTrading extends Component {
    constructor(props) {
       super(props);

        this.state = {
            listE: []
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

    }
    componentDidMount() {
        fetch('http://localhost:8080/BORABOT/SendNowTrading',{credentials: 'include'})
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    listE: result
                })
            }
        )

        // 세션 ID 같게 하려면 cors를 여기서 해결해야되나
        // require('es6-promise').polyfill();
        // fetchJsonp('http://localhost:8080/BORABOT/SendNowTrading')
        // .then(function(response){
        //     alert(response)
        //     // return response.json()
        // })
        // .then(function(json){
        //     this.setState({
        //         listE:json
        //     })
        // })
    }

    render() {
        return(
            <div >
                <form action="http://localhost:8080/BORABOT/SendNowTrading" method="GET">
                    <input type="submit" value="새로고침"/>
                </form>
                <div className = "NowTrading-elementList">
                    {this.state.listE.map((nt, i) => {
                        return (<TradingElement id = {this.props.id} name = {nt.name} endDate = {nt.endDate} 
                            coin = {nt.coin} exchange = {nt.exchange}
                            profit = {nt.profit} strategy = {nt.strategy} key = {nt.i}
                                 />);
                    })}
                </div>
            </div>
        );
    }

}

export default NowTrading;