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

class SignInfo {
	private String eMail;	// 이메일
	private String phone;	// 전화번호
	private String id;	// ID
	private String password;	// 비밀번호

	public String getEMail() { return eMail; }
	public String getPhone() { return phone; }
	public String getId() { return id; }
	public String getPassword() { return password; }
}

@ServerEndpoint("/signhandle")
public class Sign {
	// 웹소켓 통해 json 왔을 떄
    @OnMessage
    public Boolean handleMessage(String message){
        System.out.println("client is now connected... message");
        
        // json 파싱
        Gson gson = new Gson();
        SignInfo signInfo = gson.fromJson(message, SignInfo.class);
        
        // DB에 정보 넣고
        {
            if (signInfo.getId()== "db에 있다 얘는 지우자") {	// if문 말고 db 기본키 중복 오류이면 오류 전송
	            return false;	// 가입 실패
            }
            else {	// 오류 없으면 가입 메세지 전송
            	return true;	// 가입 성공
            }        	
        }        
    }
    
    @OnOpen
	public void main() {
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
