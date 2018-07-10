

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
		String username = request.getParameter("username");
		String password = request.getParameter("password");

		// perform business logic
		PrintWriter out = response.getWriter();

		// Build HTML code
		String htmlResponse = "<html>";
		htmlResponse += "<h2> Your name is : " + username + "<br/>";
		htmlResponse += "Your password is : " + password + "</h2>";
		htmlResponse += "</html>";

		out.println(htmlResponse);

	}

}
