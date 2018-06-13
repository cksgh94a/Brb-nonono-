package ws.sales.first;

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
	private Date endDate;	// 기간
	private double profit;
	
	public TradingElement(String i, String n, Boolean b, String c, String e, double p, String s, Date sD, Date eD) {
		this.id = i;
		this.name = n;
		this.status = b;
		this.coin = c;
		this.exchange = e;
		this.price = p;
		this.strategy = s;
		this.startDate = sD;
		this.endDate = eD;
	}
	
	public String getId() { return id; }
	public String getName() { return name; }
	public Boolean getStatus() { return status; }
	public String getCoin() { return coin; }
	public String getExchange() { return exchange; }
	public String getStrategy() { return strategy; }
	public double getPrice() { return price; }
	public Date getStartDate() { return startDate; }
	public Date getEndDate() { return endDate; }
	public double getProfit() { return profit; }
	
	public void setProfit(double p) { this.profit = p; }	
}
