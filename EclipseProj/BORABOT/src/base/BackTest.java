package base;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;

import backtest.BackTesting;
import tass.tradingBot;

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

    	// 거래 세부 설정
    	double priceBuyUnit = 0.0;
    	double priceSellUnit = 0.0;
    	double numBuyUnit = 0.0;
    	double numSellUnit = 0.0;
    	        	
    	switch(request.getParameter("buyingSetting")) {
	    	case "buyCertainPrice":
	    		priceBuyUnit = Double.parseDouble(request.getParameter("buyingDetail"));
	    		break;
	    	case "buyCertainNum":
	    		numBuyUnit = Double.parseDouble(request.getParameter("buyingDetail"));
	    		break;
    		default: break;
    	}
    	
    	switch(request.getParameter("buyingSetting")) {
	    	case "sellCertainPrice":
	    		priceSellUnit = Double.parseDouble(request.getParameter("sellingDetail"));
	    		break;
	    	case "sellCertainNum":
	    		numSellUnit = Double.parseDouble(request.getParameter("sellingDetail"));
	    		break;
			default: break;
		}

        new tradingBot((String) session.getAttribute("email"),
        		request.getParameter("exchange").toLowerCase(),
        		request.getParameter("botname"),
        		request.getParameter("coin"),
        		request.getParameter("base"),
        		Integer.parseInt(request.getParameter("interval")),
        		request.getParameter("startDate"),
        		request.getParameter("endDate"),
        		request.getParameter("strategyName"),
        		request.getParameter("buyingSetting"),
        		request.getParameter("sellingSetting"),
        		priceBuyUnit, priceSellUnit, numBuyUnit, numSellUnit, 0).botStart();
        
		BackTesting bt = new BackTesting((String) session.getAttribute("email"),
				request.getParameter("exchange").toLowerCase(),
				request.getParameter("coin"),
				request.getParameter("base"),
				Integer.parseInt(request.getParameter("interval")),
				request.getParameter("startDate"),
				request.getParameter("endDate"),
				request.getParameter("strategyName"),
				request.getParameter("buyingSetting"),
				request.getParameter("sellingSetting"),
				Double.parseDouble(request.getParameter("nowCash")),	
        		priceBuyUnit, priceSellUnit, numBuyUnit, numSellUnit, 0);
		
		bt.backTestRun();

		while(bt.getFlag()) {}
		JSONObject resBT = new JSONObject();
		resBT.put("ReturnDetailMessage", bt.getReturnDetailMsg());	
		resBT.put("ReturnMessage", bt.getReturnMsg());	

		PrintWriter out = response.getWriter();
		out.print(resBT.toJSONString());		
	}

}
