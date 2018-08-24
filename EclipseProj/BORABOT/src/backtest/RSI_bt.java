package backtest;

import java.util.LinkedList;
import java.util.Queue;
import exchangeAPI.CryptowatchAPI;

// period + 1

public class RSI_bt implements calcIndicator_bt {

	private int period_day;
	private int interval;
	private String coin;
	private String exchange;
	private CryptowatchAPI crypt;
	private String base;
	private int buyIndex;
	private int sellIndex;
	private double[][] HLCArr;
	private int initialStart;
	private int initialEnd;
	
	// no breakthrough
	// 미리 구해두지 않는다.
	public RSI_bt (int day, int buyIndex, int sellIndex, CryptowatchAPI c, String e, String coin, String base, int interval, double[][] hArr,  int initialStart, int initialEnd) {
		this.period_day = day;
		this.coin = coin;
		this.exchange = e;
		this.crypt = c;
		this.base = base;
		this.interval = interval;
		this.buyIndex = buyIndex;
		this.sellIndex = sellIndex;
		this.initialEnd = initialEnd;
		this.initialStart = initialStart;
		this.HLCArr = hArr;
		this.initialEnd++;
		this.initialStart++;
		// 따라서 하나를 업 시킴
		// 상향 하향 돌파 하는 지표와 같이 사용될 것이기 때문에
		// +1을 해 주어야 나중에 동일해진다.
		
		// 설령 돌파형 지표를 하나도 사용하지 않는다고 해도,
		// 거래는 시작시간 + 설정한 거래 간격 1단위시간 후에 시작되므로
		// (즉, 8월 24일 12시 30분에 30분 거래를 시작하면 1시에 첫 매매시그널을 발생시킴)
		// 플러스를 해주는게 맞다.
	}
	

	//HLCV를 가격배열로 변경
	public double[] toPriceHistory(double[][] arr) {
		
		double[] ret = new double[arr.length];
		
		for(int i = 0; i < arr.length; i++) {
			ret[i] = arr[i][2];
		}
		
		return ret;
	}
	
	
	public int getDeterminConstant() throws Exception {
		
		double[] phArr = toPriceHistory(HLCArr);
		
		double[] tempArr = IndicatorFunction_bt.makeSublist(phArr, (initialStart++), (initialEnd++));

		int det;
		double RSI;
		RSI = getRSI(tempArr);
		
		if(RSI < buyIndex) {
			det = 1;
		}
		else if(RSI > sellIndex) {
			det = -1;
		}
		else {
			det = 0;
		}
		
		return det;
	}
	
	public double getRSI(double[] hArr) throws Exception {
		// EMA가 아닌 SMA를 사용
		// fastRSI이다.
		
		double up=0;
		double down=0;
		System.out.println("plz" + hArr.length + "?" + period_day);
		for(int i = 0; i < period_day; i++) {
			
			if(hArr[i] < hArr[i+1]) {
				up += hArr[i+1] - hArr[i];
			}
			else if(hArr[i] > hArr[i+1]){
				down += hArr[i] - hArr[i+1];
			}
		}
		
		double RS = (up/period_day) / (down/period_day);
		
		double RSI = up / (up+down) * 100.0;
		RSI = 100 - (100 / (1 + RS));
		
		return RSI;
	}
	
	public double sumDouble(double[] list) {
		
		double ret=0;
		
		for(int i = 0; i < list.length; i++) {
			
			ret += list[i];
			
		}
		
		return ret;
	}
}
