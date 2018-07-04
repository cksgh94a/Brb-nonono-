import java.sql.*;

public class DB {
	private Connection con = null;
	private Statement stmt = null;
	private ResultSet rs = null; //ResultSet 객체 선언

	public ResultSet Query(String Sql, String INSSEL) {
		
		// 드라이버 로드
	    try {	
	        Class.forName("com.mysql.cj.jdbc.Driver");
	        System.out.println("드라이버 로드 성공!");
	
	    } catch (ClassNotFoundException e) {
	       System.out.println(e.getMessage());
	    }
		
	    try {	
	    	// DB 접속
	    	String url = "jdbc:mysql://localhost:3306/test?autoReconnect=true&useSSL=false&characterEncoding=UTF-8&serverTimezone=UTC";
	        con = DriverManager.getConnection(url,"root","1111");	
	        System.out.println("데이터베이스 접속 성공!");
	
	        stmt = con.createStatement();
	        
	        // INSERT문
	        if (INSSEL == "insert") {
				stmt.executeUpdate(Sql);
	        }
	        // SELECT문
	        else if (INSSEL == "select"){
				rs = stmt.executeQuery(Sql);	        	
	        } else { System.out.println("데이터베이스 구문 오류!"); }

			if(rs !=null) rs.close();			
			if(stmt != null) stmt.close();			
			if(con!= null) con.close();
	        	        
	    } catch (SQLException se) {
            se.printStackTrace();
        } finally {		
            if(con!=null) try {con.close();} catch (SQLException e) {}
        }
        return rs;	
	}
}
