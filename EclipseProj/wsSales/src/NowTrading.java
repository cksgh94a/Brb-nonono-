
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
	
	static boolean S = false;

    @OnMessage
    public String handleMessage(String id){
    	Gson gson = new Gson();
    	
    	ArrayList<TradingElement> nT = new ArrayList<TradingElement>();
    	System.out.println(id);
    	nT.clear();
    	System.out.println(ServerMain.nowTrading.size());
    	for(int i=0; i < ServerMain.nowTrading.size(); i++) {
    		if(ServerMain.nowTrading.get(i).getId().equals(id)) {
    			ServerMain.nowTrading.get(i).setResDate();
    			nT.add(ServerMain.nowTrading.get(i));
    		}
    	}
    	
    	String ntJson = gson.toJson(nT);
    	return ntJson;
    }
    
    @OnOpen
	public void hadleOpen() {
        System.out.println("현재거래 연결!");
	}

    @OnClose
    public void handleClose(){
        System.out.println("현재 거래 종료!");
    }
    
    @OnError
    public void handleError(Throwable t){
        t.printStackTrace();
    }
}
