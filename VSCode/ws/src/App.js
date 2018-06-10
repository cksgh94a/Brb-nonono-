import React, { Component } from 'react';
import './App.css';

//WebSocketEx는 프로젝트 이름
//websocket 클래스 이름
//var webSocket = new WebSocket("ws://45.120.65.65/WebSocketPrj01/serverendpointdemo");
var webSocket = new WebSocket("ws://localhost:8080/WebSocketPrj01/serverendpointdemo");
var messageTextArea = "";

//웹 소켓이 연결되었을 때 호출되는 이벤트
webSocket.onopen = function(){
    messageTextArea += "Server connect...\n";
};
//웹 소켓이 닫혔을 때 호출되는 이벤트
webSocket.onclose = function(){
    messageTextArea += "Server Disconnect...\n";
};
//웹 소켓이 에러가 났을 때 호출되는 이벤트
webSocket.onerror = function(){
    messageTextArea += "error...\n";
};
//웹 소켓에서 메시지가 날라왔을 때 호출되는 이벤트
webSocket.onmessage = function(msg){
    messageTextArea += "Recieve From Server => "+msg.data+"\n";
};

class App extends Component {

    //Send 버튼을 누르면 실행되는 함수
    sendMessage = () => {
        var message = document.getElementById("textMessage");
        messageTextArea += "Send to Server => "+message.value+"\n";
        //웹소켓으로 textMessage객체의 값을 보낸다.
        webSocket.send(message.value);
        console.log(message.value +"\n"+ messageTextArea);
        document.getElementById("messageTextArea").value = messageTextArea;
        //textMessage객체의 값 초기화
        message.value = "";
    }
    //웹소켓 종료
    disconnect = () => {
        webSocket.close();
    }
    render() {
        return (
        <div>
        <form>
            <input id="textMessage" type="text"/>
            <input onClick={this.sendMessage} value="Send" type="button"/>
            <input onClick={this.disconnect} value="Disconnect" type="button"/>
        </form>
        <br />
        <textarea id="messageTextArea" rows="10" cols="50"> 
        </textarea>
        </div>
        );
    }
}

export default App;
