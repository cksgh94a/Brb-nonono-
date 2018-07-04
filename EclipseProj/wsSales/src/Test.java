import java.sql.*;

public class Test {
	public void test() {
		String API_KEY = "";
		String Secret_KEY= "";
		
		DB useDB = new DB();
		
		String selectSql = String.format("SELECT API_KEY, "
				+ "Secret_KEY FROM APIKEY WHERE _ID = \"%s\" and exchangeName = \"%s\" ;", "dirtyrobot00", "bithumb");
		ResultSet rs = useDB.Query(selectSql, "select"); // tradeº¿Á¤º¸ insert
	
		try {
			while(rs.next()) {  
				API_KEY = rs.getString("API_KEY");
				Secret_KEY = rs.getString("Secret_KEY");
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();			
		}
		System.out.println(API_KEY + " && " + Secret_KEY);
	}
}
