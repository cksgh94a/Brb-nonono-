import java.sql.*;

public class DB {

	static void useDB(String Sql, String INSSEL) {
		Connection con = null;
		Statement stmt = null;
		ResultSet rs = null; //ResultSet 객체 선언
		
	    try {
	        Class.forName("com.mysql.cj.jdbc.Driver");
	        System.out.println("드라이버 로드 성공!");
	
	    } catch (ClassNotFoundException e) {
	       System.out.println(e.getMessage());
	    }
		
	    try {
	
	        String url = "jdbc:mysql://localhost:3306/test?autoReconnect=true&useSSL=false&characterEncoding=UTF-8&serverTimezone=UTC";
            System.out.println("데이터베이스 접속 성공!");
	
	        con = DriverManager.getConnection(url,"root","");
	
	        System.out.println("데이터베이스 연결 성공!");
	
	        stmt = con.createStatement();
	        
	        if (INSSEL == "insert") {
				stmt.executeUpdate(Sql);
	        	
	        } else if (INSSEL == "select"){
				rs = stmt.executeQuery(Sql);

//				while(rs.next()) {  
//					
//					API_KEY = rs.getString(1);
//					Secret_KEY = rs.getString(2);
//				}
	        	
	        } else { System.out.println("데이터베이스 사용 오류!"); }
	
	
	        
//	        stmt.close();	
//	        con.close();	
	    } catch (SQLException se) {
            se.printStackTrace();
        } finally {		
            if(con!=null) try {con.close();} catch (SQLException e) {}
        }
	}
}
