package base;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class Post
 */
@WebServlet("/Post")
public class Post extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Post() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// 데이터 인코딩 설정
	    request.setCharacterEncoding("utf-8");
	    response.setContentType("text/html;charset=utf-8");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// 데이터 인코딩 설정
	    request.setCharacterEncoding("utf-8");
	    response.setContentType("text/html;charset=utf-8");

        HttpSession session = request.getSession();
        String sql = "";
        if(request.getParameter("action") == "write") 
    		sql = String.format("INSERT INTO board VALUES('"
    				+session.getAttribute("email")+"', '"
    				+request.getParameter("content")+"', '"
    				+request.getParameter("post_time")+"', '"
    				+request.getParameter("title")+"')");
        else if(request.getParameter("action") == "modify") 
			sql = String.format("INSERT INTO board VALUES('"
					+session.getAttribute("email")+"', '"
					+request.getParameter("content")+"', '"
					+request.getParameter("post_time")+"', '"
					+request.getParameter("title")+"')");
        else System.out.println("Post 오류!!!");        
		
		DB useDB = new DB();
		useDB.Query(sql, "insert");
		
		useDB.clean();
	}

}
