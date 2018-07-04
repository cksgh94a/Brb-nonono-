
//import java.sql.Connection;
//import java.sql.DriverManager;
//import java.sql.ResultSet;
//import java.sql.SQLException;
//import java.sql.Statement;
//import java.time.LocalDate;
//import java.time.LocalTime;
//
//import com.google.gson.Gson;
//import com.google.gson.JsonObject;
//import com.google.gson.JsonParser;
//
//import java.util.*;
//import java.io.BufferedWriter;
//import java.io.File;
//import java.io.FileWriter;

class initializing {

	// websocket 통신으로 받아오는 부분
	// 동시에 db저장
	// NowTrading에 쓰이는 부분
	// nowTrading or Trade?
	private static String exchange = "bithumb";
	private static String coin_target = "btc";
	private static String coin_base = "krw";
	private static String _ID = "dirtyrobot00";
	private static double priceAmount = 7500000;
	private static String startDate = "180606";
	private static String endDate = "180704";
	private static String botName = "패턴아 맞아라";
	private static String strategyName = "patternNaked";
	
	public initializing(TradingElement t) {
		this.exchange = t.getExchange();
		this.coin_target = t.getCoin();
		this._ID = t.getId();
		this.priceAmount = t.getPrice();
		this.botName = t.getId()+t.getName();
		this.strategyName = t.getStrategy();		
	}

	// db에서 받아옴
	// SELECT APIKEY, Secret_KEY FROM Customer, APIKEY WHERE Customer._id =
	// APIKEY._id AND exchange = {exchange}
	//private static String API_KEY = "485f69323ae844f99f2ef3ae81692a1e";
	//private static String Secret_KEY = "3289895f108b435e8a4633df2b5cdf61";
	private static String API_KEY="";
	private static String Secret_KEY="";
	
	public void main() {
		// TODO Auto-generated method stub
		// 함수내부로
		// 추후에 tradingBot에다가 이 걸 넘겨줘도 됨
		String APIK;
		String SecK;
		String selectSql = String.format("SELECT API_KEY, Secret_KEY FROM APIKEY WHERE _ID = \"%s\" and exchangeName = \"%s\" ;", _ID, exchange);
//		DB.useDB(selectSql, "select");	// key select

		String coin_ex = "";
		String coin_crypto = coin_target + coin_base;
		if (exchange.equals("bittrex")) {
			coin_ex = coin_base + "-" + coin_target;
		}
		else if(exchange.equals("bithumb")) {
			coin_ex = coin_target;
		}

//		DB.useDB(selectSql, "insert"); // trade봇정보 insert
		tradingBot trbot = new tradingBot(priceAmount, _ID, startDate, endDate, exchange, coin_crypto, coin_ex, "none",
				API_KEY, Secret_KEY, botName);
		if (strategyName.equals("bollingerPatternNaked"))
			trbot.bollingerPatternNaked();
		else if (strategyName.equals("Bollingertrade"))
			trbot.Bollingertrade();
		else if (strategyName.equals("patterNakedTrade"))
			trbot.patterNakedTrade();
		else 
			System.out.println("전략 선택 오류다!!!");
	}
	
	/*
	public static void SQL_Select() {
		Connection conn = null;
		Statement stmt = null;
		ResultSet rs = null; // ResultSet 객체 선언
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			System.out.println("드라이버 로드 성공!");
			conn = DriverManager.getConnection(url);
			System.out.println("데이터베이스 접속 성공!");
			stmt = conn.createStatement();
			//String selectSql = String.format("INSERT INTO trade VALUES(\"%s\", \"%s\", \"%s\", \"%s\", \"%s\", %s, \"%s\", \"%s\", \"%s\" ,\"%s\")", _ID, coin_target, priceAmount, "null", strategyName, 1, exchange, botName, startDate, endDate);
			String selectSql = String.format("SELECT API_KEY, Secret_KEY FROM APIKEY WHERE _ID = \"%s\" and exchangeName = \"%s\" ;", _ID, exchange);
			System.out.println(selectSql);
			rs = stmt.executeQuery(selectSql);
			
			while(rs.next()) {  
				
				API_KEY = rs.getString(1);
				Secret_KEY = rs.getString(2);
			}

		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException se) {
			se.printStackTrace();
		} finally {
			if (conn != null)
				try {
					conn.close();
				} catch (SQLException e) {
				}
		}
	}
	
	public static void SQL_Insert() {
		Connection conn = null;
		Statement stmt = null;
		ResultSet rs = null; // ResultSet 객체 선언
		
		try {

			Class.forName("com.mysql.cj.jdbc.Driver");
			System.out.println("드라이버 로드 성공!");
			conn = DriverManager.getConnection(url);
			System.out.println("데이터베이스 접속 성공!");
			stmt = conn.createStatement();
			String selectSql = String.format("INSERT INTO trade VALUES(\"%s\", \"%s\", \"%s\", \"%s\", \"%s\", %s, \"%s\", \"%s\", \"%s\" ,\"%s\")", _ID, coin_target, priceAmount, "null", strategyName, 1, exchange, botName, startDate, endDate);
			System.out.println(selectSql);
			stmt.executeUpdate(selectSql);

		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException se) {
			se.printStackTrace();
		} finally {
			if (conn != null)
				try {
					conn.close();
				} catch (SQLException e) {
				}
		}
	}*/

}