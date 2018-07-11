

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class DoLogin
 */
@WebServlet("/DoLogin")
public class DoLogin extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DoLogin() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		// read form data
		
		// 데이터 인코딩 설정
	    request.setCharacterEncoding("utf-8");
	    response.setContentType("text/html;charset=utf-8");

		String email = request.getParameter("email");
		String password = request.getParameter("password");

		// 세션에 사용자 정보 저장
		HttpSession session = request.getSession();
		session.setAttribute("Email", email);
		System.out.println(session.getId());

	    // DB의 사용자 비밀번호를 받아와서 전송
//		String selectSql = String.format("SELECT password from customer where email=\'%s\'", email);
//				
//		ResultSet rs = DB.Query(selectSql, "select"); 
//		
//		String pwd= "";
//		try {
//			while(rs.next()) {
//				pwd = rs.getString("password");
//				System.out.println("password = " + pwd);
//			}
//		} catch (SQLException e) {
//			e.printStackTrace();			
//		}		
//		
//		// 5. DB 사용후 clean()을 이용하여 정리
//		DB.clean();	

		// 로그인 버튼 후 화면 지정
		response.sendRedirect("http://localhost:3000");
	}

}
