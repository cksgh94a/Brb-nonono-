


import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.ServerEndpoint;

import java.util.*;

//import com.google.gson.Gson;
//
//import java.io.BufferedWriter;
//import java.io.File;
//import java.io.FileWriter;


// 봇 메인 클래스
@ServerEndpoint("/mainhandle")
public class ServerMain extends Thread {
			
	// <봇 이름, 상태> 맵 => 봇이 이부분 참조하여 실행, 정지
	static Map<String, Boolean> map = new HashMap<String, Boolean>();
	
	// 현재 진행중인 거래 리스트
	static ArrayList<TradingElement> nowTrading = new ArrayList<TradingElement>();
	
	private String name;	// 개별 봇 이름
	private TradingElement tElement;
	
	public ServerMain() {}
	public ServerMain(String s, TradingElement t) { 
		this.name = s;
		this.tElement = t;
		}	// 봇 이름 설정하는 생성자
	
	// 봇 실행 함수
	public void run() {
        System.out.println("스레드 실행");

    	initializing bot = new initializing(tElement); 
    	bot.main();
        
	}

	// 웹소켓 통해 json 왔을 떄
    @OnMessage
    public void handleMessage(String message){
        System.out.println("메시지를 받았습니다");
        
        Test t = new Test();
        t.test();
        
//        // json 파싱
//        Gson gson = new Gson();
//        TradingElement tInfo = gson.fromJson(message, TradingElement.class);
//        
//    	nowTrading.add(tInfo);	// 현재 진행 중인 거래 기록
//    	
//        // 봇 실행 상태 기록
//        map.put(tInfo.getId()+tInfo.getName(), tInfo.getStatus());
//        
//        
//        
//        if(tInfo.getStatus()) {	// 실행 신호 오면 봇 새로 만들어서 실행
//            ServerMain bot = new ServerMain(tInfo.getId()+tInfo.getName(), tInfo);
//            bot.start();
//        }
//        
//        else {
//        	for(int i = nowTrading.size() - 1; i >= 0; i--) {
//        		
//        		if((nowTrading.get(i).getId()+nowTrading.get(i).getName()).equals(tInfo.getId()+tInfo.getName())) {
//        			nowTrading.remove(i);
//        		}
//    		} 
//        }
    }
    
    @OnOpen
	public void handleOpen() {
        System.out.println("Hello ServerMain!");
	}

    @OnClose
    public void handleClose(){
        System.out.println("ByeBye ServerMain~");
    }
    
    @OnError
    public void handleError(Throwable t){
        t.printStackTrace();
    }
}
