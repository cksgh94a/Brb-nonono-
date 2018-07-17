

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class TradeMain
 */
@WebServlet("/TradeMain")
public class TradeMain extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TradeMain() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		// 데이터 인코딩 설정
	    request.setCharacterEncoding("utf-8");
	    response.setContentType("text/html;charset=utf-8");

		long period = Long.parseLong(request.getParameter("period"));

        HttpSession session = request.getSession();
        
		// period 아직 미완
		ElementTrading tInfo = new ElementTrading(
				(String) session.getAttribute("email"),
				Boolean.valueOf(request.getParameter("status")),
//				Boolean.valueOf(request.getParameter("status")).booleanValue(),
				request.getParameter("botname"),
				request.getParameter("coin"),
				request.getParameter("exchange"),
				Double.parseDouble(request.getParameter("asset")),
				request.getParameter("strategy"));
		
		

        if (tInfo.getStatus()) {	// 거래 시작 (DB에 거래 정보 입력)
            tInfo.insertDB();
            TradeBot trade = new TradeBot(tInfo);
            trade.main();
        }
    
        else {	// 거래 종료 (DB의 거래 상태, 거래 종료 시간 변경) 
    		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    		DB.Query(String.format(
    				"update trade set status=0, end_date=\'%s\' where email=\'%s\' and bot_name=\'%s\'" ,
        			dateFormat.format(new Date()), tInfo.getEmail(), tInfo.getName()), "insert");		
    		DB.clean();		
        }

	}
}
