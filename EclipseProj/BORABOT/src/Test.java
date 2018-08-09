import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import DB.DB;
import tass.CoinRecommendation;

public class Test {

	public static void main(String[] args) {
	    JSONObject jObject = new JSONObject();

	    CoinRecommendation cr = new CoinRecommendation();
	    
	    jObject.put("volumeHigh", cr.getVolumeHighlyIncreasingCoin());
	    jObject.put("priceHigh", cr.getPriceHighlyIncreasingCoin());
	    jObject.put("biggestGap", cr.get24BiggestGapCoin());

	    JSONArray jArray = new JSONArray();
	    for (String exchange: cr.getExchangeList())	jArray.add(exchange);
	    jObject.put("exchangeList", jArray);
	    
	    System.out.println(jObject);

	    
	}

}
