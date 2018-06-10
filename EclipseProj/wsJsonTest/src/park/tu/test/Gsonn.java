package park.tu.test;

import com.google.gson.*;
import java.util.ArrayList;
import java.util.List;

public class Gsonn {
    
    public String toJson(String query, String category)
    {
        Gson gson = new Gson();
        
        List<String> searchData = new ArrayList<String>();
        searchData.add(query);
        searchData.add(category);
        
        
        return gson.toJson(searchData);
    }
}
