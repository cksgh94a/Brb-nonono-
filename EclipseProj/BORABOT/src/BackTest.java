

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import backtest.BackTesting;

/**
 * Servlet implementation class BactTest
 */
@WebServlet("/BackTest")
public class BackTest extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public BackTest() {
        super();
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		// 데이터 인코딩 설정
	    request.setCharacterEncoding("utf-8");
	    response.setContentType("application/json;charset=utf-8");
	    
		HttpSession session = request.getSession();
		
		System.out.println(request.getParameter("buySetting"));
		
		new BackTesting((String) session.getAttribute("email"),
				request.getParameter("exchange"),
				request.getParameter("coin"),
				request.getParameter("base"),
				Integer.parseInt(request.getParameter("interval")),
				request.getParameter("startDate"),
				request.getParameter("endDate"),
				request.getParameter("strategyName"),
				request.getParameter("buyingSetting"),
				request.getParameter("sellingSetting"),
				0.0, 0.0, 0.0, 0.0, 0).backTestRun();
	}

}
