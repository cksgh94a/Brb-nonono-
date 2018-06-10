import React, { Component } from 'react';


const webSocket = new WebSocket("ws://localhost:8080/wsJson/nowtrading");
class Five extends Component {
    componentDidMount(){
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
            alert("err");
            messageTextArea += "error...\n";
        };
        //웹 소켓에서 메시지가 날라왔을 때 호출되는 이벤트
        webSocket.onmessage = function(msg){
            messageTextArea += "Recieve From Server => "+msg.data+"\n";
        };
    }

    //Send 버튼을 누르면 실행되는 함수
    sendMessage = () => {
        var message = document.getElementById("textMessage");
        this.messageTextArea += "Send to Server => "+message.value+"\n";
        //웹소켓으로 textMessage객체의 값을 보낸다.
        webSocket.send(message.value);
        console.log(message.value +"\n"+ this.messageTextArea);
        document.getElementById("messageTextArea").value = this.messageTextArea;
        //textMessage객체의 값 초기화
        message.value = "";
    }
    //웹소켓 종료
    disconnect = () => {
        this.webSocket.close();
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

export default Five;
