import java.text.SimpleDateFormat;
import java.util.Date;

import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.Gson;

@ServerEndpoint("/authhandle")
public class Auth {

	// 웹소켓 통해 json 왔을 떄
    @OnMessage
    public void handleMessage(String message){
        System.out.println("메시지를 받았습니다");
        
        // json 파싱
        Gson gson = new Gson();
        AuthElement aInfo = gson.fromJson(message, AuthElement.class);

        System.out.println(aInfo.getEmail() + aInfo.getPassword());
        aInfo.insertDB();
    }
    
    @OnError
    public void handleError(Throwable t){
        t.printStackTrace();
    }
}
