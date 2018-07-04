
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.ServerEndpoint;

//진행 중인 거래 정보 전송
@ServerEndpoint("/authhandle")
public class User {

    @OnMessage
    public void handleMessage(String auth){
        System.out.println("정보 받음!");
    }
    
    @OnOpen
	public void hadleOpen() {
        System.out.println("회원가입 연결!");
	}

    @OnClose
    public void handleClose(){
        System.out.println("회원가입 종료!");
    }
    
    @OnError
    public void handleError(Throwable t){
        t.printStackTrace();
    }
}
