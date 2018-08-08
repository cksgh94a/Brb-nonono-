package tass;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

class CoinRecommendation {

	private String[] bithumbCoinList = { "BTC", "ETH", "DASH", "LTC", "ETC", "XRP", "BCH", "XMR", "ZEC", "BTG", "EOS" };

	private String[] coinoneCoinList = { "btc", "bch", "eth", "etc", "ltc", "btg" };

	static String[] binanceCoinList = { "BCCUSDT", "BNBUSDT", "BTCUSDT", "ETHUSDT", "LTCUSDT", "NEOUSDT", "QTUMUSDT",
			"ADAUSDT", "EOSUSDT", "TUSDUSDT", "XLMUSDT", "XRPUSDT", "ICXUSDT", "ONTUSDT", "TRXBTC", "ETHBTC", "XRPBTC",
			"NEOBTC", "BCDBTC", "BNBBTC", "VIBBTC", "WTCBTC", "ELFBTC", "ICXBTC", "IOSTBTC", "VENBTC", "EOSBTC",
			"XLMBTC", "XVGBTC", "PPTBTC", "ONTBTC", "OMGBTC", };

	private Map<String, String[]> exchangeCoinList = new HashMap<String, String[]>();

	private String[] exchangeList = { "bithumb", "coinone", "binance" };

	public CoinRecommendation() {

		exchangeCoinList.put("bithumb", bithumbCoinList);
		exchangeCoinList.put("coinone", coinoneCoinList);
		exchangeCoinList.put("binance", binanceCoinList);
	}
	
	public Map<String, String> getVolumeHighlyIncreasingCoin() {
		
		Map<String, String> retMap = new HashMap<String, String>();
		String[] retRecCoin = new String[3];
		
		for(int i = 0; i < exchangeList.length; i++) {
			
			String[] tempCoinList = exchangeCoinList.get(exchangeList[i]);
			String coin="";
			double rate = 0;
			
			for(int j = 0; j < tempCoinList.length; j++) {
				long now = System.currentTimeMillis()/1000;
				String getSql = String.format(" select AVG(v) from  %sOHLC_300_%s WHERE uTime between %s and %s", exchangeList[i], tempCoinList[j], now-43210, now+100);
				String getSql2 = String.format(" select AVG(v) from  %sOHLC_300_%s WHERE uTime between %s and %s", exchangeList[i], tempCoinList[j], now-86420, now+43200);
				DB_ohlc dbCoin = new DB_ohlc();
				DB_ohlc dbCoin2 = new DB_ohlc();
				ResultSet rs = dbCoin.Query(getSql, "select");
				
				ResultSet rs2 = dbCoin2.Query(getSql2, "select");
				double prevprev=0;
				double prev=0;
				try {
					while(rs.next()) {
						prevprev = rs.getDouble(1);
					}
					while(rs2.next()) {
						prev = rs2.getDouble(1);
					}
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				dbCoin.clean();
				dbCoin2.clean();
				
				if( ( prev - prevprev ) / prevprev > rate) {
					rate = ( prev - prevprev ) / prevprev;
					coin = tempCoinList[j];
				}
			}
			
			retMap.put(exchangeList[i], coin);
		}
		
		return retMap;
	}
	
	public Map<String, String> getPriceHighlyIncreasingCoin() {
		
		Map<String, String> retMap = new HashMap<String, String>();
		String[] retRecCoin = new String[3];
		
		for(int i = 0; i < exchangeList.length; i++) {
			
			String[] tempCoinList = exchangeCoinList.get(exchangeList[i]);
			String coin="";
			double rate = 0;
			
			for(int j = 0; j < tempCoinList.length; j++) {
				long now = System.currentTimeMillis()/1000;
				String getSql = String.format(" select AVG(c) from  %sOHLC_300_%s WHERE uTime between %s and %s", exchangeList[i], tempCoinList[j], now-43210, now+100);
				String getSql2 = String.format(" select AVG(c) from  %sOHLC_300_%s WHERE uTime between %s and %s", exchangeList[i], tempCoinList[j], now-86420, now+43200);
				DB_ohlc dbCoin = new DB_ohlc();
				DB_ohlc dbCoin2 = new DB_ohlc();
				ResultSet rs = dbCoin.Query(getSql, "select");
				
				ResultSet rs2 = dbCoin2.Query(getSql2, "select");
				double prevprev=0;
				double prev=0;
				try {
					while(rs.next()) {
						prevprev = rs.getDouble(1);
					}
					while(rs2.next()) {
						prev = rs2.getDouble(1);
					}
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				dbCoin.clean();
				dbCoin2.clean();
				
				if( ( prev - prevprev ) / prevprev > rate) {
					rate = ( prev - prevprev ) / prevprev;
					coin = tempCoinList[j];
				}
			}
			
			retMap.put(exchangeList[i], coin);
		}
		
		return retMap;
	}

	public Map<String, String> get24BiggestGapCoin() {
	
		Map<String, String> retMap = new HashMap<String, String>();
		String[] retRecCoin = new String[3];
		
		for(int i = 0; i < exchangeList.length; i++) {
			
			String[] tempCoinList = exchangeCoinList.get(exchangeList[i]);
			String coin="";
			double rate = 0;
			
			for(int j = 0; j < tempCoinList.length; j++) {
				long now = System.currentTimeMillis()/1000;
				String getSql = String.format(" select MAX(h), MIN(l) from  %sOHLC_300_%s WHERE uTime between %s and %s", exchangeList[i], tempCoinList[j], now-864100, now+100);
				DB_ohlc dbCoin = new DB_ohlc();
				ResultSet rs = dbCoin.Query(getSql, "select");
				double high=0, low=0;
				
				try {
					while(rs.next()) {
						high = rs.getDouble(1);
						low = rs.getDouble(2);
					}
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				if( (high-low)/low > rate ) {
					rate = (high-low)/low;
					coin = tempCoinList[j];
				}
				dbCoin.clean();
			}
			
			retMap.put(exchangeList[i], coin);
		}
		
		return retMap;
	}
}
