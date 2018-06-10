package com.za.tutorial.websocket;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.ServerEndpoint;

import java.io.File;
import java.io.FileWriter;

@ServerEndpoint("/serverendpointdemo")
public class ServerEndpointDemo {    /***
     * 웹 소켓이 연결되면 호출되는 이벤트
     */
    @OnOpen
    public void handleOpen(){
        System.out.println("client is now connected...");
    }
    /**
     * 웹 소켓으로부터 메시지가 오면 호출되는 이벤트
     * @param message
     * @return
     */
    @OnMessage
    public String handleMessage(String message){
        System.out.println("receive from client : "+message);
        String replymessage = "echo "+message;
        System.out.println("send to client : "+replymessage);
        
        
       String txt = "테스트입니다!!" ;
        
       String fileName = "/usr/local/server/test11.txt" ;
        
        
       try{
            
           // 파일 객체 생성
           File file = new File(fileName) ;
            
           // true 지정시 파일의 기존 내용에 이어서 작성
           FileWriter fw = new FileWriter(file, true) ;
            
           // 파일안에 문자열 쓰기
           fw.write(txt);
           fw.flush();

           // 객체 닫기
           fw.close();
            
            
       }catch(Exception e){
           e.printStackTrace();
       }
	
        return replymessage;
    }
    /**
     * 웹 소켓이 닫히면 호출되는 이벤트
     */
    @OnClose
    public void handleClose(){
        System.out.println("client is now disconnected...");
    }
    /**
     * 웹 소켓이 에러가 나면 호출되는 이벤트
     * @param t
     */
    @OnError
    public void handleError(Throwable t){
        t.printStackTrace();
    }
}