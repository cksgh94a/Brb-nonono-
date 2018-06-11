package ws.sales.first;


import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.Gson;

import java.util.*;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

@ServerEndpoint("/mainhandle")
public class SalesBot extends Thread {	
	static Map<String, Boolean> map = new HashMap<String, Boolean>();
	private String name;
	
	public SalesBot() {}
	public SalesBot(String s) { this.name = s; }
	
	public void run() {
        System.out.println("client is now connected... thread");
        
        try {
            //파일 객체 생성
            File file = new File("/usr/local/server/apache-tomcat-8.0.52/webapps/"+this.name+".txt");
            BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(file));
            
    		while(map.get(this.name)) {
                if(file.isFile() && file.canWrite()){ 
                Date d = new Date();            
                String s = d.toString();
                    //쓰기
                    bufferedWriter.write(this.name + " " + s);
                    //개행문자쓰기
                    bufferedWriter.newLine();  
                }
    			Thread.sleep(2000);
    		}      
            
            bufferedWriter.close();
        } catch(Exception e) {        	
        }
	}
    
    @OnOpen
	public void main() {
        System.out.println("client is now connected... ");
	}

    @OnMessage
    public void handleMessage(String message){
        System.out.println("client is now connected... message");
        Gson gson = new Gson();
        SalesInfo sInfo = gson.fromJson(message, SalesInfo.class);
        
        map.put(sInfo.getName(), sInfo.getStatus());
        
        if(sInfo.getStatus()) {
            SalesBot bot = new SalesBot(sInfo.getName());
            bot.start();        	
        }
    }

    @OnClose
    public void handleClose(){
        System.out.println("client is now disconnected...");
    }
    
    @OnError
    public void handleError(Throwable t){
        t.printStackTrace();
    }
}
