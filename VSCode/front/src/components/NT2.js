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

//var webSocket = new WebSocket("ws://45.120.65.65/tass/tassSqlSelect");
var webSocket = new WebSocket("ws://127.0.0.1:8080/tass/tassSqlSelect")
let msg;
class NowTrading extends Component {

    state={

    }
    
    componentDidMount(){
        
    }
    
    render() {

        let NowTradingSql = "SELECT botName, startDate, coin, exchangeName, startAsset FROM trade WHERE onGoing = 1;"
        //let WebSocket = new WebSocket("ws://:http://45.120.65.65:80/src/selectDB");
        //let webSocket = new WebSocket("ws://45.120.65.65/React_jh/tass/tassSqlSelect");
        console.log("websocket 호출바로 뒷코드 ");
        //웹 소켓이 열렸을 때
        webSocket.onopen = function(message){
            // nowTrading을 위한 table Trade 에서 정보를 불러온다
            //let NowTradingSql = "SELECT * FROM TRADE WHERE _ID = \"dirtyrobot00\"";
            webSocket.send(NowTradingSql);
        };
        //웹 소켓이 닫혔을 때 호출되는 이벤트
        webSocket.onclose = function(message){
            msg += "Server Disconnect...\n";
        };
        //웹 소켓이 에러가 났을 때 호출되는 이벤트
        webSocket.onerror = function(message){
            msg += "error...\n";
        };
        
        //메세지가 날아왔을 때 -> setState로 바꾸자
        // ***
        // JSON 으로 받아온다
        // result : {이름, 시작날짜, 코인이름, 거래소, priceAmount}, {},...
        // 뭐가 받아오는 부분인지 모르겠다.
        // 받아와서 json 파싱해서 setState해줌.
        webSocket.onmessage = function(message){
            msg += "Recieve From Server => "+message.data+"\n";
            console.log( msg );
        };

        return(
            //state가 없으면 다른거표시(없습니다 같은)
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

// export default NowTrading;