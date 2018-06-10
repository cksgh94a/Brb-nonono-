import React, { Component } from 'react';
import './NowTrading.css';


const rb1 = {
    name : "존버가즈아",
    date : "2018-5-24",
    coin : "XRP",
    exchange : "COINONE",
    profit : "54.2",
    strategy : "불린저밴드"
}

const rb2 = {
    name : "내꺼1",
    date : "2018-4-3",
    coin : "BTC",
    exchange : "COINONE",
    profit : "-123.2",
    strategy : "custom1"
}


const rb3 = {
    name : "아는형님꺼",
    date : "2018-3-24",
    coin : "XRP",
    exchange : "BITTREX",
    profit : "254.2",
    strategy : "custom2"
}


class NowTrading extends Component {

    render() {
        return(
            <div >
                <div className = "NowTrading-elementList">
                <div className = "NowTrading-element" >
                    <b>{rb2.name}</b>)&nbsp;&nbsp;{rb2.date}
                    <br></br>
                    {rb2.coin} &nbsp; / &nbsp;{rb2.exchange}
                    <br></br>
                    {rb2.profit}%&nbsp; / &nbsp;{rb2.strategy}
                </div>

                <div className = "NowTrading-element" >
                <b>{rb3.name}</b>)&nbsp;&nbsp;{rb3.date}
                    <br></br>
                    {rb3.coin} &nbsp; / &nbsp;{rb3.exchange}
                    <br></br>
                    {rb3.profit}%&nbsp; / &nbsp;{rb3.strategy}
                </div>

                <div className = "NowTrading-element" >
                    <b>{rb1.name}</b>)&nbsp;&nbsp;{rb1.date}
                    <br></br>
                    {rb1.coin} &nbsp; / &nbsp;{rb1.exchange}
                    <br></br>
                    {rb1.profit}%&nbsp; / &nbsp;{rb1.strategy}
                </div>

                <div className = "NowTrading-element" >
                    <b>{rb3.name}</b>)&nbsp;&nbsp;{rb3.date}
                    <br></br>
                    {rb3.coin} &nbsp; / &nbsp;{rb3.exchange}
                    <br></br>
                    {rb3.profit}%&nbsp; / &nbsp;{rb3.strategy}
                </div>

                <div className = "NowTrading-element" >
                    <b>{rb1.name}</b>)&nbsp;&nbsp;{rb1.date}
                    <br></br>
                    {rb1.coin} &nbsp; / &nbsp;{rb1.exchange}
                    <br></br>
                    {rb1.profit}%&nbsp; / &nbsp;{rb1.strategy}
                </div>
                </div>


            </div>
        );
    }

}

export default NowTrading;