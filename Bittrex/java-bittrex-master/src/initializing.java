
public class initializing {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		Bittrex brx = new Bittrex("485f69323ae844f99f2ef3ae81692a1e", "3289895f108b435e8a4633df2b5cdf61", 10,1);
		
		System.out.println(brx.getBalances());
		
	}

}
