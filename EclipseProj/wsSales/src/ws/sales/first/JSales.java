package ws.sales.first;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.ServerEndpoint;

import java.io.BufferedWriter;
import java.io.FileWriter;


import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

@ServerEndpoint("/jsales")
public class JSales {	
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
    public void handleMessage(String message){
        System.out.println("receive from client : "+message);
        try {
            JSONParser jsonParser = new JSONParser();
            
            //JSON데이터를 넣어 JSON Object 로 만들어 준다.
            JSONObject jsonObject = (JSONObject) jsonParser.parse(message);
            
            //books의 배열을 추출
            JSONArray salesInfoArray = (JSONArray) jsonObject.get("sales");

            System.out.println("=====Members=====");
            for(int i=0 ; i<salesInfoArray.size() ; i++){
                JSONObject tempObj = (JSONObject) salesInfoArray.get(i);
                System.out.println(""+(i+1)+"번째 멤버의 이름 : "+tempObj.get("코인종류"));
                System.out.println(""+(i+1)+"번째 멤버의 이메일 : "+tempObj.get("거래소"));
                System.out.println(""+(i+1)+"번째 멤버의 나이 : "+tempObj.get("전략"));
                System.out.println(""+(i+1)+"번째 멤버의 나이 : "+tempObj.get("금액"));
                System.out.println(""+(i+1)+"번째 멤버의 나이 : "+tempObj.get("기간"));
                System.out.println("----------------------------");
            }
                   	
        }
        catch (ParseException e) {
        	e.printStackTrace();
        }
        String fileName = "/usr/local/server/res.txt" ;
        
        
        try{
                         
            // BufferedWriter 와 FileWriter를 조합하여 사용 (속도 향상)
            BufferedWriter fw = new BufferedWriter(new FileWriter(fileName, true));
             
            // 파일안에 문자열 쓰기
            fw.write(message);
            fw.flush();
 
            // 객체 닫기
            fw.close();
             
             
        }catch(Exception e){
            e.printStackTrace();
        }

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
