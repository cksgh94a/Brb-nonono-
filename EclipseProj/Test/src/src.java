import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class src {
	public static void main(String[] args) {
		try {
			JSONObject object = new JSONObject();
			object.put("Hi", "Hello");
			
			JSONArray array = new JSONArray();
			array.put("Kim").put("MagmaTart");
			
			object.put("Friends", array);
			
			System.out.println(object);
			System.out.println(object.get("Friends"));
		} catch(JSONException e) {
			e.printStackTrace();
		}
	}
}