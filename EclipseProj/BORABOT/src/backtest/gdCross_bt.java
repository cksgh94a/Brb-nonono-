package backtest;

import Indicator.IndicatorFunction;
import exchangeAPI.CryptowatchAPI;

// period

public class gdCross_bt implements calcIndicator_bt {

	private int longd;
	private int shortd;
	private CryptowatchAPI crypt;
	private String exchange;
	private String coin;
	private String base;
	private int interval;
	private int meanType;
	private double prevLong;
	private double prevShort;
	private int initialStart;
	private int initialEnd;
	private double[][] HLCVArr;
	private double[] phArr;

	// mT = 평균종류. 0이면 SMA, 1이면 EMA
	public gdCross_bt(int longd, int shortd, int mT, CryptowatchAPI c, String e, String coin, String base, int interval,
			double[][] hArr, int initialStart, int initialEnd) throws Exception {
		this.longd = longd;
		this.shortd = shortd;
		this.crypt = c;
		this.exchange = e;
		this.coin = coin;
		this.base = base;
		this.interval = interval;
		this.meanType = mT;
		this.HLCVArr = hArr;
		this.phArr = IndicatorFunction_bt.toPriceHistory(hArr);
		this.initialEnd = initialEnd;
		this.initialStart = initialStart;

		//longTempArr이 더 긴 데이터를 가지고 있음.
		double[] longTempArr = IndicatorFunction_bt.makeSublist(phArr, initialStart, initialEnd);
		double[] shortTempArr = IndicatorFunction_bt.makeSublist(phArr, initialStart + (longd - shortd), initialEnd);
		initialStart++;
		initialEnd++; // ?

		// 골든 크로스의 경우 교차를 해야 하기 때문에
		// 볼린저맨드처럼 또한 미리 구해두어야 함.
		try {
			this.prevLong = getPriceMA(mT, longTempArr);
			this.prevShort = getPriceMA(mT, shortTempArr);
		} catch (Exception e2) {
			throw new Exception();
		}
	}

	public int getDeterminConstant() throws Exception {

		double[] longTempArr = IndicatorFunction_bt.makeSublist(phArr, initialStart, initialEnd);
		double[] shortTempArr = IndicatorFunction_bt.makeSublist(phArr, initialStart + (longd - shortd), initialEnd);
		initialStart++;
		initialEnd++;

		// 0 - 대기 , 1 - 구매, -1 - 판매
		double longMA = getPriceMA(meanType, longTempArr);
		double shortMA = getPriceMA(meanType, shortTempArr);
		int det;

		if (prevShort < prevLong) {
			if (shortMA > longMA) {
				// 단기가 장기 위로 돌파 : 매수
				det = 1;
			} else {
				det = 0;
			}
		} else if (prevShort > prevLong) {
			if (shortMA < longMA) {
				// 장기가 단기 위로 돌파 : 매도
				det = -1;
			} else {
				det = 0;
			}
		} else {
			det = 0;
		}
		
		return det;
	}

	public double getPriceMA(int mT, double[] historyArr) throws Exception {

		if (mT == 0) {
			// 단순평균
			
			return sumDouble(historyArr) / historyArr.length;
		}

		else {
			// 지수평균
			
			return IndicatorFunction_bt.getEMA(historyArr);
		}

	}

	public double sumDouble(double[] arr) {

		double ret = 0;

		for (int i = 0; i < arr.length; i++) {

			ret += arr[i];
		}

		return ret;
	}

}
