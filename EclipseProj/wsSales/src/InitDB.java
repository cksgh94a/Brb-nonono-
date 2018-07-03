import java.sql.*;

public class InitDB {

	static void connect() {
	    try {
	        Class.forName("com.mysql.cj.jdbc.Driver");
	        System.out.println("드라이버 로드 성공!");
	
	    } catch (ClassNotFoundException e) {
	       System.out.println(e.getMessage());
	    }
	
	
	
	    try {
	
	        String url = "jdbc:mysql://localhost:3306/test?autoReconnect=true&useSSL=false&characterEncoding=UTF-8&serverTimezone=UTC";
	
	        Connection con = DriverManager.getConnection(url,"root","");
	
	        System.out.println("mysql connect suc");
	
	        Statement stmt = con.createStatement();
	
	        ResultSet rs = stmt.executeQuery("select * from Customer");
	
	        System.out.println("Got result:");
	
	        while(rs.next()) {
	
	            String no= rs.getString(1);
	
	            String tblname  = rs.getString(1);
	
	            System.out.println(" no = " + no);
	
	            System.out.println(" tblname= "+ tblname);
	
	        }
	
	
	
	        stmt.close();
	
	        con.close();
	
	    } catch(java.lang.Exception ex) {
	
	        ex.printStackTrace();
	
	        System.out.println("here5");
	
	    }
	}
}
