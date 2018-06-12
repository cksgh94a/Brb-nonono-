import React, { Component } from 'react';
import './NowTrading.css';
import NTComp from './NTComp';


const ntHandle = new WebSocket("ws://45.120.65.65/wsSales/nthandle");
ntHandle.onmessage = (event) => {
    const listJ = new Array(JSON.parse(event.data));
}

const list = [
    {name : "존버가즈아", date : "2018-5-24", coin : "XRP", 
    exchange : "COINONE", profit : "54.2", strategy : "불린저밴드"},
    {name : "내꺼1", date : "2018-4-3", coin : "BTC",
    exchange : "COINONE", profit : "-123.2", strategy : "custom1"},
    {name : "아는형님꺼", date : "2018-3-24", coin : "XRP",
    exchange : "BITTREX", profit : "254.2", strategy : "custom2"}
]


class NowTrading extends Component {
    render() {
        return(
            <div >
                <div className = "NowTrading-elementList">
                    <div>
                    {list.map((nt) => {
                        return (<NTComp name = {nt.name} date = {nt.date} 
                            coin = {nt.coin} exchange = {nt.exchange}
                            profit = {nt.profit} strategy = {nt.strategy}
                                 />);
                    })}
                    </div>
                </div>
            </div>
        );
    }

}

export default NowTrading;