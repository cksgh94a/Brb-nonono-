package ws.sales.first;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.Gson;

import java.util.*;

// 진행 중인 거래 정보 전송
@ServerEndpoint("/nthandle")
public class NowTrading {

    @OnMessage
    public String handleMessage(String id){
    	Gson gson = new Gson();
    	
    	ArrayList<TradingElement> nT = new ArrayList<TradingElement>();
    	System.out.println(id);
    	nT.clear();
    	System.out.println(SalesBot.nowTrading.size());
    	for(int i=0; i < SalesBot.nowTrading.size(); i++) {
    		if(SalesBot.nowTrading.get(i).getId().equals(id)) {
    			nT.add(SalesBot.nowTrading.get(i));
    		}
    	}
    	
    	String ntJson = gson.toJson(nT);
    	return ntJson;
    }
    
    @OnOpen
	public void hadleOpen() {
        System.out.println("nt client is now connected... ");
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
