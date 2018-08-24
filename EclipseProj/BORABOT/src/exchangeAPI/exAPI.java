package exchangeAPI;

// 모든 거래소api객체에 구현될 인터페이스
// 해당 기능들을 추상적으로 잡아주고
// 각각의 클래스에서 구체적으로 구현, 그 방법은 거래소마다 다양하다.
public interface exAPI {
	
	public String buyCoin(String coin, String base, String qty);
	
	public String sellCoin(String coin, String base, String qty);
	
	public double getTicker(String coin, String base);

	public double getBalance(String currency);
	
	public String getAllBalances();
}

class ExException extends Exception{
	
}