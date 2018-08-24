package backtest;

import java.util.Iterator;
import java.util.Queue;

import Indicator.calcIndicator;
import exchangeAPI.CryptowatchAPI;

// 필요한 기간(만큼)
// period_day

// 볼린저 밴드 
// 새로 받아온 현재 가격이 볼린저 밴드를 '상향 돌파'(즉, 밑에서 위로 치고 올라올 때) 구매를 하고
// '하향 돌파'의 모습을 그리면 판매를 함.
// 이 상향 돌파, 하향 돌파의 움직임을 포착하기 위해 이전의 상태와 현재 상태 두 가지가 필요.
// 경우의 수를 따져서 시그널 생성 값을 도출
public class BollingerBand_bt implements calcIndicator_bt, calcIndicator{
	
	private int period_day;
	private CryptowatchAPI crypt;
	private String exchange;
	private String coin;
	private String base;
	private int interval;
	private int mul; // 표준편차
	private int prevStatus;
	private int nowStatus;
	private double prevBotm; // 전역 변수 '이전하한'
	private double prevTop; // 전역 변수 '이전상한'
	
	private int initialStart;
	private int initialEnd;
	private double[] hpArr;
	
	public BollingerBand_bt(int period,int mul, CryptowatchAPI c, String e, String coin, String base, int interval,  double[][] HLCVarr, int initialStart, int initialEnd) throws Exception{
		this.period_day = period;
		this.crypt = c;
		this.exchange = e;
		this.coin = coin;
		this.base = base;
		this.interval = interval;
		this.mul = mul;
		this.prevStatus = 0;
		this.nowStatus = 0;
		this.initialEnd = initialEnd;
		this.initialStart = initialStart;
		
		// 볼린저밴드는 HLCV중에 C만 필요함
		hpArr = IndicatorFunction_bt.toPriceHistory(HLCVarr);
		
		double[] tempArr = IndicatorFunction_bt.makeSublist(hpArr, initialStart, initialEnd);
		
		// 여기서 지표 객체 생성 시에 미리 구해둠. -> 시그널 생성 값을 얻기 위해 이전과 현재 두가지가 필요하기 때문!
		// 여기서 prevBotm과 prevTop, prevStatus를 미리 구함
		double[] bolinger = getBollinger(tempArr);
		this.prevBotm = bolinger[0];
		this.prevTop = bolinger[1];
	}
	
	public int getDeterminConstant() throws Exception{

		double[] tempArr = IndicatorFunction_bt.makeSublist(hpArr, initialStart++, initialEnd++);
		// 0 - 대기 , 1 - 구매, -1 - 판매
		double[] bollinger = getBollinger(tempArr);
		
		double nowPrice = bollinger[2];
		double bottom = bollinger[0];
		double top = bollinger[1];
		int det;
		
		// * prevTop은 이전에 구한 볼린저밴드의 윗쪽 선(상한계)
		// prevBottom은 하한계
		
		if(nowPrice > prevTop) {
			// 현재 가격이 볼린저밴드의 top보다 높은 경우!
			prevTop = top;
			prevBotm = bottom;
			nowStatus = 1; // 현재 상태를 1로 consider
		}
		else if(nowPrice < prevBotm) {
			// 현재 가격이 볼린저밴드의 bottom보다 낮은 경우!
			prevTop = top;
			prevBotm = bottom;
			nowStatus = -1;
		}
		else {
			// 볼린저밴드 그 사이에 있는 경우
			prevTop = top;
			prevBotm = bottom;
			nowStatus = 0;
		}
		
		// 이전 상태가 1(가격이 볼린저밴드의 top보다 높은상태)인데 현재 상태는 0(가격이 볼린저밴드 내부에 존재)이면
		// 하향돌파 : 판매
		if(prevStatus == 1 && nowStatus == 0) { 
			det =  -1;
		}
		// 이전 상태가 -1(가격이 볼린저밴드의 bottom보다 낮은상태)인데 현재 상태는 0(가격이 볼린저밴드 내부에 존재)이면
		// 상향돌파 : 판매
		else if (prevStatus == -1 && nowStatus == 0) {
			det =  1;
		}
		// 그 외의 경우에는 대기
		// 1이었다가 -1인 경우도 추가해야함.
		else {
			det = 0;
		}
		
		prevStatus = nowStatus;
		return det;
	}
	
	// 볼린저 밴드 구하는 공식
	// 표준편차를 이용
	public double[] getBollinger(double[] hArr) throws Exception {
		
		double nowPrice = hArr[hArr.length-1];
		double average = IndicatorFunction_bt.sumDouble(hArr) / hArr.length;
		
		double devsqr = 0;
		for(int i = 0; i < hArr.length; i++) {
			
			devsqr += (int)Math.pow(average-hArr[i], mul);
			
		}

		double deviation = devsqr / hArr.length;
		double stddev = Math.sqrt(deviation);
		
		//System.out.print("average : " + average);
		//System.out.print(" / 분산  : " + deviation);
		//System.out.print(" / 표준편차 : " + stddev);
		//System.out.print(" / 다음 상한 : " + (average + stddev));
		//System.out.print(" / 다음 하한 : " + (average - stddev));

		double ret[] = { average + stddev, average - stddev, nowPrice };
		return ret;
	}
	
}
