package backtest;

import java.time.LocalDateTime;
import java.time.ZoneId;

import exchangeAPI.CryptowatchAPI;
import tass.initializing;

// period_day+period_day-1

public class CommodityChannelIndex_bt implements calcIndicator_bt {

	private int period_day;
	private CryptowatchAPI crypt;
	private String exchange;
	private String coin;
	private String base;
	private int interval;
	private double prevCCI;
	private int buyIndex;
	private int sellIndex;
	int cnt = 0;
	
	
	private int initialStart;
	private int initialEnd;
	private double[] phArr;
	
	public CommodityChannelIndex_bt(int period, int buyIndex, int sellIndex, CryptowatchAPI c, String e, String coin, String base, int interval, double[][] hArr, int initialStart, int initialEnd) throws Exception{
		this.period_day = period;
		this.crypt = c;
		this.exchange = e;
		this.coin = coin;
		this.base = base;
		this.interval = interval;
		this.buyIndex = buyIndex;
		this.sellIndex = sellIndex;
		this.initialStart = initialStart;
		this.initialEnd = initialEnd;
		
		// CCI는 가격 데이터만 필요함.
		this.phArr = IndicatorFunction_bt.toPriceHistory(hArr);
		
		double[] tempArr = IndicatorFunction_bt.makeSublist(phArr, initialStart, initialEnd);
		
		// 볼린저밴드에서 설명했듯이
		// CCI도 상향,하향 돌파 시 시그널을 생성
		// 따라서 미리 구해둠
		this.prevCCI = getCCI(tempArr);
	}
	
	@Override
	public int getDeterminConstant() throws Exception{
		
		double[] tempArr = IndicatorFunction_bt.makeSublist(phArr, initialStart++, initialEnd++);
		
		// 0 대기 , 1 구매, -1 판매
		double nowCCI = getCCI(tempArr);
		//System.out.print("prevCCI : " + prevCCI + " nowCCI : " + nowCCI);
		int det;
		
		// 볼린저밴드와 같은 알고리즘
		if(prevCCI < buyIndex) {
			if(nowCCI > buyIndex) {
				det = 1;
			}
			else {
				det = 0;
			}
		}
		else if ( prevCCI > sellIndex) {
			if(nowCCI < sellIndex) {
				det = -1;
			}
			else {
				det = 0;
			}
		}
		else {
			det = 0;
		}
		return det;
	}
	
	// CCI 구하는 공식
	// 주어진 hArr가지고만 구하면 된다.
	public double getCCI(double[] hArr) throws Exception{
		
		double M = hArr[hArr.length-1];
		double N = getMean(makeSublist(hArr, hArr.length-period_day, hArr.length-1));
	
		double sumDev = 0;
		
		for(int i = 0; i < period_day; i++) {
		
			sumDev += Math.abs(N - hArr[hArr.length-1-i]);
		}
		
		double D = sumDev / period_day;
		return (M-N) / (D * 0.015);
	}
	
	private double[] makeSublist(double[] arr, int s, int e) {
		
		double[] ret = new double[e-s+1];
		
		for(int i = 0; i < e-s+1; i++) {
			
			ret[i] = arr[i+s];
			
		}
		return ret;
	}
	
	
	private double getMean(double[] hArr) {
		
		double sum=0;
		
		for(int i = 0; i<hArr.length; i++) {
			sum += hArr[i];
		}
		double ret = sum / hArr.length;
		return ret;
	}
	
	
}
