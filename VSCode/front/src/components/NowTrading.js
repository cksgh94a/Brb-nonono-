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

    state={

    }
    componentDidMount(){
        let NowTradingSql = "SELECT coin, exchange FROM transaction_log"
        const webSocket = new WebSocket("ws://localhost:8080/src/selectDB");
        //웹 소켓이 열렸을 때
        webSocket.onopen = function(message){
            // messageTextArea.value += "Server connect...\n";s

            // nowTrading을 위한 table Trade 에서 정보를 불러온다
            let NowTradingSql = "SELECT * FROM TRADE WHERE _ID = \"dirtyrobot00\"";
            webSocket.send(NowTradingSql);
        };
        //웹 소켓이 닫혔을 때 호출되는 이벤트
        webSocket.onclose = function(message){
            // messageTextArea.value += "Server Disconnect...\n";
        };
        //웹 소켓이 에러가 났을 때 호출되는 이벤트
        webSocket.onerror = function(message){
            // messageTextArea.value += "error...\n";
        };
        
        //메세지가 날아왔을 때 -> setState로 바꾸자
        // ***
        // JSON 으로 받아온다
        // result : {이름, 시작날짜, 코인이름, 거래소, priceAmount}, {},...
        // 뭐가 받아오는 부분인지 모르겠다.
        // 받아와서 json 파싱해서 setState해줌.
        webSocket.onmessage = function(message){
            // messageTextArea.value += "Recieve From Server => "+message.data+"\n";
            // console.log( messageTextArea.value);
        };


    }
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