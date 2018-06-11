package ws.sales.first;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.Date;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.Gson;

import java.io.BufferedWriter;
import java.io.FileWriter;

class SalesInfo{
	private boolean status;
	private String coin;
	private String exchange;
	private String strategy;
	private String price;
	private String deadline;

	public boolean getStatus() { return status; }
	public String getCoin() { return coin; }
	public String getExchange() { return exchange; }
	public String getStrategy() { return strategy; }
	public String getPrice() { return price; }
	public String getDeadline() { return deadline; }
}

@ServerEndpoint("/mainhandle")
public class SalesBot {	

    @OnOpen
    public void openBotHandle() {
    	BotHandle bH = new BotHandle();    	    	
    }
	static boolean STATUS;
	
	public void main(boolean b) throws InterruptedException {
        System.out.println("client is now connected... 메인");
        STATUS = b;
    	System.out.println(STATUS);

//        String fileNameD = "/usr/local/server/apache-tomcat-8.0.52/webapps/React_ch/resDate.txt" ;
//		while(STATUS) {
//	        try{
//	    		Date dt = new Date();
//	    		System.out.println(dt.toString());
//	    		
//	            BufferedWriter fwD = new BufferedWriter(new FileWriter(fileNameD, true));
//	             
//	            fwD.write(dt.toString()+"\n");
//	            fwD.flush(); 
//	            fwD.close();	             	             
//	        }
//	        catch(Exception e){
//	            e.printStackTrace();
//	        }
//			System.out.println("되냥!\n");
//			Thread.sleep(2000);
//		}
		
	}
}
