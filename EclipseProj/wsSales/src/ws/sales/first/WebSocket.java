package ws.sales.first;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.ServerEndpoint;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.Date;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;


@ServerEndpoint("/jstart")
class Start {	
    @OnOpen
    public void handleOpen(){
        System.out.println("client is now connected...");
    }
    /**
     * @param message
     * @return
     */
    @OnMessage
    public void handleMessage(String message){
    	SalesBot.STATUS = true;
        try {
            JSONParser jsonParser = new JSONParser();
            
            JSONObject jsonObject = (JSONObject) jsonParser.parse(message);
            
            JSONArray salesInfoArray = (JSONArray) jsonObject.get("sales");

            System.out.println("=====Members=====");
            for(int i=0 ; i<salesInfoArray.size() ; i++){
                JSONObject tempObj = (JSONObject) salesInfoArray.get(i);
            }
                   	
        }
        catch (ParseException e) {
        	e.printStackTrace();
        }
        
        String fileName = "/usr/local/server/res.txt" ;               
        try{
            BufferedWriter fw = new BufferedWriter(new FileWriter(fileName, true));
             
            fw.write(message);
            fw.flush(); 
            fw.close();           
             
        }catch(Exception e){
            e.printStackTrace();
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

@ServerEndpoint("/jstop")
class Stop {	
    @OnOpen
    public void handleOpen(){
        System.out.println("client is now connected...");
    }
    /**
     * @param message
     * @return
     */
    @OnMessage
    public void handleMessage(String message){
    	SalesBot.STATUS = false;
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
