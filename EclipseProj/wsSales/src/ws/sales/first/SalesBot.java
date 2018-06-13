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


// 봇 메인 클래스
@ServerEndpoint("/bothandle")
public class SalesBot extends Thread {
			
	// <봇 이름, 상태> 맵 => 봇이 이부분 참조하여 실행, 정지
	static Map<String, Boolean> map = new HashMap<String, Boolean>();
	
	// 현재 진행중인 거래 리스트
	static ArrayList<TradingElement> nowTrading = new ArrayList<TradingElement>();
	
	private String name;	// 개별 봇 이름
	
	public SalesBot() {}
	public SalesBot(String s) { this.name = s; }	// 봇 이름 설정하는 생성자
	
	// 봇 실행 함수
	public void run() {
        System.out.println("client is now connected... thread");
        
        try {
            //파일 객체 생성
            File file = new File("/usr/local/server/apache-tomcat-8.0.52/webapps/"+this.name+".txt");
            BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(file));
            
            /*
             * 여기다가 로직 호출하면 될듯
             */
            
    		while(map.get(this.name)) {
                if(file.isFile() && file.canWrite()){ 
	                Date d = new Date();            
	                String time = d.toString();
                    bufferedWriter.write(this.name + " " + time + map + "\n" + nowTrading);	// 쓰기
                    bufferedWriter.newLine();	// 개행문자쓰기  
                }
    			Thread.sleep(2000);	// 이부분이나 로직 함수에서 슬립해서 거래하면 될듯
    		}      
            bufferedWriter.close();	// 로그는 임시로 마지막에 한번에 생성하게 해놈
            
        } catch(Exception e) {        	
        }
	}

	// 웹소켓 통해 json 왔을 떄
    @OnMessage
    public void handleMessage(String message){
        System.out.println("client is now connected... message");
        
        // json 파싱
        Gson gson = new Gson();
        TradingElement tInfo = gson.fromJson(message, TradingElement.class);
        
    	nowTrading.add(tInfo);
    	
        // 봇 실행 상태 기록
        map.put(tInfo.getId()+tInfo.getName(), tInfo.getStatus());
        
        
        if(tInfo.getStatus()) {	// 실행 신호 오면 봇 새로 만들어서 실행
            SalesBot bot = new SalesBot(tInfo.getId()+tInfo.getName());
            bot.start();
        }
        
        else {
        	for(int i = nowTrading.size() - 1; i >= 0; i--) {
        		
        		if((nowTrading.get(i).getId()+nowTrading.get(i).getName()).equals(tInfo.getId()+tInfo.getName())) {
        			System.out.println("지우냐???");
        			nowTrading.remove(i);  
        			
        		}
    		} 
        }
    }
    
    @OnOpen
	public void handleOpen() {
        System.out.println("client is now connected... ");
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
