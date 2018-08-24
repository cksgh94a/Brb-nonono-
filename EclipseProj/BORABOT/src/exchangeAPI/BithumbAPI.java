package exchangeAPI;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import DB.DB_ohlc;

public class BithumbAPI implements exAPI {

	private String api_key;
	private String secret_key;
	private Api_Client api;

	public BithumbAPI(String api_key, String secret_key) {
		api = new Api_Client(api_key, secret_key);
	}

	@Override
	public double getTicker(String coin, String base) {

		String symb = coin;

		DB_ohlc db = new DB_ohlc();
		String sql = String.format("SELECT price from bithumbOneMinute%s ORDER BY t_id DESC LIMIT 1",
				symb.toUpperCase());
		double res = 0;

		try {
			ResultSet rs = db.Query(sql, "select");
			while (rs.next()) {
				res = rs.getDouble(1);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return res;
	}

	@Override
	public String buyCoin(String coin, String base, String qty) {

		String units = qty;
		String currency = coin;

		HashMap<String, String> rgParams = new HashMap<String, String>();

		rgParams.put("order_currency", coin);
		rgParams.put("payment_currency", base);
		rgParams.put("units", units);
		rgParams.put("currency", currency);

		String result = null;
		try {
			result = api.callApi("/trade/market_buy/", rgParams);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}

	public double manageAsset(double nowAsset, String result) {

		double ret = 0;

		JsonParser parser = new JsonParser();
		JsonElement element = parser.parse(result);
		JsonObject jsnObj = element.getAsJsonObject();

		return ret;
	}

	public String sellCoin(String coin, String base, String qty) {

		String units = qty;
		String currency = coin;

		HashMap<String, String> rgParams = new HashMap<String, String>();

		rgParams.put("order_currency", coin);
		rgParams.put("payment_currency", base);
		rgParams.put("units", units);
		rgParams.put("currency", currency);

		String result = null;
		try {
			result = api.callApi("/trade/market_sell/", rgParams);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	@Override
	public double getBalance(String coin) {		
		HashMap<String, String> rgParams = new HashMap<String, String>();

		if(coin.equals("KRW") || coin.equals("krw")) {
			coin = "btc";
		}
		rgParams.put("currency", coin);
		String result = null;
		try {
			result = api.callApi("/info/balance", rgParams);
		} catch (Exception e) {
			e.printStackTrace();
		}
		// System.out.println(result);
		
		JsonObject ohlc_json;
		try {
			ohlc_json = new JsonParser().parse(result).getAsJsonObject();
		} catch (Exception e) {
			String json = "{"+result+"}";

			int errorCode = new JsonParser().parse(json).getAsJsonObject().get("message").getAsJsonObject().get("status").getAsInt();
			String errorMsg = new JsonParser().parse(json).getAsJsonObject().get("message").getAsJsonObject().get("message").getAsString();
			
			System.out.println("bithumb API Key 오류! : " + errorMsg);
			
			return -1;
		}
		JsonObject data = ohlc_json.get("data").getAsJsonObject();
		
		double balance = -1;
		
		if (coin.equals("krw") || coin.equals("KRW")) {
			balance = data.get("available_krw").getAsDouble();
		} else {
			balance = data.get("available_" + coin.toLowerCase()).getAsDouble();
		}

		return balance;
	}

	@Override
	public String getAllBalances() { // Returns all balances in your account

		HashMap<String, String> rgParams = new HashMap<String, String>();

		rgParams.put("order_currency", "ALL");
		rgParams.put("payment_currency", "krw");

		String result = null;
		try {
			result = api.callApi("/info/balance", rgParams);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}
}
