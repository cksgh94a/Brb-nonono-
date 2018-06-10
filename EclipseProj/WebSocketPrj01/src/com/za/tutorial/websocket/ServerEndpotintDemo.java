package com.za.tutorial.websocket;


import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/serverendpointdemo")
public class ServerEndpotintDemo {
	
	/***
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
    	/*
    	ArrayList<Integer> a = new ArrayList<>();
    	ArrayList<Integer> b = new ArrayList<>();
    	a.add(1);	a.add(2);	a.add(3);
    	b.add(4);	b.add(5);	b.add(6);
    	ArrayList<ArrayList<Integer>> d = new ArrayList<>();
    	d.add(a);
    	d.add(b);
    	
        JSONObject obj = new JSONObject();
		try {
			JSONArray jArray = new JSONArray();//배열이 필요할때
			for (int i = 0; i < d.size(); i++)//배열
			{
				JSONObject sObject = new JSONObject();//배열 내에 들어갈 json
				sObject.put("contentid", d.get(i).get(0));
				sObject.put("contentid", d.get(i).get(1));
				sObject.put("contentid", d.get(i).get(2));
				jArray.put(sObject);
			}
			obj.put("planName", "planA");
			obj.put("id", "userID");
			obj.put("item", jArray);//배열을 넣음
			
			System.out.println(obj.toString());
		
		} catch (JSONException e) {
			e.printStackTrace();	
		}*/
        System.out.println("receive from client : "+message);
        String replymessage = "echo "+message;
        System.out.println("send to client : "+replymessage);
        //return obj.toString();
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