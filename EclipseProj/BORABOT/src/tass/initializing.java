package tass;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Timer;
import java.util.TimerTask;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import Indicator.MACDs;
import backtest.BackTesting;
import exchangeAPI.*;
public class initializing {
	
	public static void printArray(double[] arr) {
		
		for(int i = 0; i < arr.length; i++) {
			System.out.print(arr[i]+" ");
		}
		System.out.println();
	}
	
	// websocket 통신으로 받아오는 부분
	// 동시에  db저장(INSERT INTO trade VALUES(); )
	private static String email = "dirtyrobot00@gmail.com";
	private static String botName = "mybo12t";
	private static String exchange = "bithumb";
	private static String coin = "ltc";
	private static String base = "krw";
	private static String strategyName = "johnbur1";
	private static int interval = 300;
	private static String startDate = "2018-07-18T00:00:00.000";
	private static String endDate = "2018-06-19T14:25:00";
	
	// 매매량 세팅
	private static String buySetting = "buyAll";
	private static String sellSetting = "sellAll";
	
	//optional
	private static double priceBuyUnit;
	private static double priceSellUnit;
	private static double numBuyUnit;
	private static double numSellUnit;
	
	//errorHandle : 1 => 대기
	//				0 => shutdown
	private static int errorHandling = 0;
	
	public static void main(String[] args) {
		// TODO Auto-generated method stub

		//new BackTesting(email, exchange, coin, base, interval, startDate, endDate, strategyName, buySetting, sellSetting,  priceBuyUnit, priceSellUnit, numBuyUnit,  numSellUnit, errorHandling).backTestRun();
		new tradingBot(email, exchange, botName, coin, base, interval, startDate, endDate, strategyName, buySetting, sellSetting,  priceBuyUnit, priceSellUnit, numBuyUnit,  numSellUnit, errorHandling).botStart();
		
		
	}

}