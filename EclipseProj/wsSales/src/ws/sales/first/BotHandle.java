package ws.sales.first;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.ServerEndpoint;

import java.io.BufferedWriter;
import java.io.FileWriter;

import com.google.gson.Gson;

@ServerEndpoint("/bothandle")
class BotHandle {	
    @OnOpen
    public void handleOpen(){
        System.out.println("client is now connected... 핸들러");
    }
    /**
     * @param message
     * @return
     */
    @OnMessage
    public void handleMessage(String message){
        Gson gson = new Gson();
        SalesInfo sInfo = gson.fromJson(message, SalesInfo.class);
        SalesBot.STATUS = sInfo.getStatus();
        System.out.println(message+"핸들러");
 
        
        if (sInfo.getStatus()) {   	
            try{
            	            	
//                String fileName = "/usr/local/server/apache-tomcat-8.0.52/webapps/React_ch/res.txt" ;
//                
//                BufferedWriter fw = new BufferedWriter(new FileWriter(fileName, true));
//
//                fw.write("c = " + sInfo.getCoin());
//                fw.write(", s = " + sInfo.getStrategy());
//                fw.write(", p = " + sInfo.getPrice());
//                fw.write(", d = " + sInfo.getDeadline());
//                fw.flush(); 
//                fw.close();
                System.out.println(message+"통과");
                 
            }catch(Exception e){
                e.printStackTrace();
            }        	
        }
        else {      	
        }

    }
    @OnClose
    public void handleClose(){
        System.out.println("client is now disconnected...");
    }
    /**
     * @param t
     */
    @OnError
    public void handleError(Throwable t){
        t.printStackTrace();
    }
}