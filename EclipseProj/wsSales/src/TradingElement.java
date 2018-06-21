
import java.util.*;

class TradingElement{
	private String id;
	private String name;
	private Boolean status;	// 봇 상태
	private String coin;
	private String exchange;
	private String strategy;
	private double price;	// 시작 금액
	private Date startDate;
	private long period;	// 기간
	private String profit = "100.00";
	private long residualDate;
	
	public TradingElement(String i, String n, Boolean b, String c, String e, double p, String s, Date sD, long pd) {
		this.id = i;
		this.name = n;
		this.status = b;
		this.coin = c;
		this.exchange = e;
		this.price = p;
		this.strategy = s;
		this.startDate = sD;
		this.period = pd;
	}
	
	public String getId() { return id; }
	public String getName() { return name; }
	public Boolean getStatus() { return status; }
	public String getCoin() { return coin; }
	public String getExchange() { return exchange; }
	public String getStrategy() { return strategy; }
	public double getPrice() { return price; }
	public Date getStartDate() { return startDate; }
	public long getEndDate() { return period; }
	public String getProfit() { return profit; }
	
	public void setProfit(String p) { this.profit = p; }	
	public void setResDate() {
		long ed = this.startDate.getTime()+ 24*60*60*1000*period;
		this.residualDate = (ed - new Date().getTime()) / (24*60*60*1000);
	}
	
}
