import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

class Member { 
	private String id;
	private String name;
	private int age;
	private String address;
	public String getId() { return id; } 
	public void setId(String id) { this.id = id; } 
	public String getName() { return name; } 
	public void setName(String name) { this.name = name; } 
	public int getAge() { return age; } 
	public void setAge(int age) { this.age = age; } 
	public String getAddress() { return address; } 
	public void setAddress(String address) { this.address = address; } 
	@Override 
	public String toString() {
		return "Member [id=" + id + ", name=" + name + ", age=" + age + ", address=" + address + "]"; } 
	}

public class src {
	public static void main(String[] args) {
		Gson gson = new Gson(); 
		String jsonString = "{'id':'jekalmin','name':'Min','age':26,'address':'Seoul'}";
		System.out.print(gson.fromJson(jsonString, Member.class));
	}
}