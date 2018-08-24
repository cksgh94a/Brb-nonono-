package backtest;

import exchangeAPI.CryptowatchAPI;
import DB.DB;
import Indicator.*;

import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Stack;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

// 백테스트 클래스 생성 
// run함수 실행 !
public class BackTestingPerform {

	private static String exchange;
	private static String coin;
	private static String base;
	private static int interval;

	private static String email; // 이메일
	private static String strategyName; // 백테스트에 사용할 전략 이름
	private static String buyingSetting; // 구매 방식 설정
	private static String sellingSetting; // 판매 방식 설정

	private static String startDate; // 시작 시간
	private static String endDate; // 종료 시간 : 루프 탈출 요소

	// 택 1
	private static double priceBuyUnit; // 한 번 구매에 사용하는 금액 (얼마치)
	private static double numBuyUnit; // 한 번에 구매할 코인의 갯수 (몇개)
	// 택 1
	private static double priceSellUnit; // 판매
	private static double numSellUnit; // 판매

	private static double buyCriteria; // 구매 기준치; 지표들의 생성 값 합이 해당 기준치를 넘으면 구매
	private static double sellCriteria; // 판매 기준치

	private double nowCash; // 현재 캐쉬(돈)
	private double nowCoin; // 현재 코인
	private double initialCash; // 시작 캐쉬
	private double initialCoin = 0;

	String returnMessage = "";
	String returnDetailMessage = ""; // 결과값 확인을 위한 메세지

	JsonObject resultLog = new JsonObject();
	JsonArray resultLogArr = new JsonArray(); // 앞단에 값을 전달하기 위한 제이슨

	// 크립토 : 필요없음
	private static CryptowatchAPI crypt = new CryptowatchAPI(20, 60);

	public BackTestingPerform(String email, String exchange, String coin, String base, double initialCash, int interval,
			String startDate, String endDate, String strategyName, String buyingSetting, String sellingSetting,
			double priceBuyUnit, double priceSellUnit, double numBuyUnit, double numSellUnit, int error) {

		// 앞단에서 받아오는 내용-> 백테스트 하는데 필요한 종합적인 설정들
		this.exchange = exchange;
		this.coin = coin;
		this.base = base;
		this.interval = interval;

		this.email = email; // 노필요
		this.strategyName = strategyName;
		this.startDate = startDate;
		this.endDate = endDate;

		this.buyingSetting = buyingSetting;
		this.sellingSetting = sellingSetting;
		this.priceBuyUnit = priceBuyUnit;
		this.numBuyUnit = numBuyUnit;
		this.priceSellUnit = priceSellUnit;
		this.numSellUnit = numSellUnit;
		this.initialCash = initialCash;
		this.nowCash = initialCash;
		this.nowCoin = initialCoin;
	}

	public String backTestRun() {

		System.out.println("시작 코인 : " + nowCoin + " / 시작 금액 : " + (long) nowCash);

		CryptowatchAPI crypt = new CryptowatchAPI(10, 10);

		// 디비에서 전략 내용 (제이슨) 불러오기
		// ----------------------------------------------------------------------
		String settingSelectSql = String.format(
				"SELECT strategy_content FROM custom_strategy WHERE email = \"%s\" and strategy_name = \"%s\"; ", email,
				strategyName);
		String strategySettingJson = "";

		DB db = new DB();
		try {
			ResultSet rsTemp = db.Query(settingSelectSql, "select");
			if (rsTemp.next()) {
				strategySettingJson = rsTemp.getString(1);
			}
			/*
			 * else{ return "fail : 지표 내용 불러오기 오류"; }
			 */
			db.clean();
		} catch (Exception e) {
			e.printStackTrace();
		}
		// ----------------------------------------------------------------------

		// System.out.println("test" + strategySettingJson); // 시험용

		// 지표 내용 제이슨에서 필요한 값들을 파싱.
		JsonParser parser = new JsonParser();
		JsonElement element = parser.parse(strategySettingJson);
		JsonObject jsnObj = element.getAsJsonObject();

		buyCriteria = jsnObj.get("buyCriteria").getAsInt();
		sellCriteria = jsnObj.get("sellCriteria").getAsInt();
		String expList[] = jsnObj.get("expList").getAsString().split(","); // expList는 사용하지 않음.

		JsonObject indicatorListJs = jsnObj.get("indicatorList").getAsJsonObject();

		// calcIndicator_bt는 지표객체를 담기 위한 큰 객체(인터페이스).
		// 각각의 지표객체는 calcIndicator_bt 인터페이스를 구현함.
		calcIndicator_bt[] indicatorCalcer = new calcIndicator_bt[indicatorListJs.size()];

		// 가중치 리스트
		int weightList[] = new int[indicatorListJs.size()];

		// maxPeriod 를 찾기
		// 각각의 period는 제이슨 활용

		// startDate -> UTC -> UTC - maxPeriod
		// maxPeriod는 백테스트를 좀 더 수월하게 하기 위해 사용하는 방식.
		// 즉, 각각의 지표를 적용할 떄 마다 DB에서 데이터를 불러 오는 형식이 아닌,
		// 처음에 사용하는 지표로 부터 필요한 모든 데이터를 DB에 한 번만 접근하여 한 번만 불러옴.
		// 후에 반복적으로 서브리스트를 만들며 큰 데이터를 활용.
		int maxPeriod = 0;

		// 지표이름에 맞게 해당 지표를 계산하는데 필요한 '기간'을 비교.
		for (int i = 0; i < indicatorListJs.size(); i++) {

			String indicator = indicatorListJs.get(i + "").getAsJsonObject().get("indicator").getAsString();
			int tempPeriod;

			if (indicatorListJs.get(i + "").getAsJsonObject().get("indicator").getAsString().equals("CCI")) {
				tempPeriod = indicatorListJs.get(i + "").getAsJsonObject().get("period").getAsInt()
						+ indicatorListJs.get(i + "").getAsJsonObject().get("period").getAsInt() - 1;
			} else if (indicatorListJs.get(i + "").getAsJsonObject().get("indicator").getAsString()
					.equals("BollingerBand")) {
				tempPeriod = indicatorListJs.get(i + "").getAsJsonObject().get("period").getAsInt();
			} else if (indicatorListJs.get(i + "").getAsJsonObject().get("indicator").getAsString().equals("gdCross")) {
				tempPeriod = indicatorListJs.get(i + "").getAsJsonObject().get("longD").getAsInt();
			} else if (indicatorListJs.get(i + "").getAsJsonObject().get("indicator").getAsString()
					.equals("gdVCross")) {
				tempPeriod = indicatorListJs.get(i + "").getAsJsonObject().get("longD").getAsInt();
			} else if (indicatorListJs.get(i + "").getAsJsonObject().get("indicator").getAsString()
					.equals("StochOsc")) {
				tempPeriod = indicatorListJs.get(i + "").getAsJsonObject().get("n").getAsInt()
						+ indicatorListJs.get(i + "").getAsJsonObject().get("m").getAsInt()
						+ indicatorListJs.get(i + "").getAsJsonObject().get("t").getAsInt() - 2;
			} else {
				tempPeriod = indicatorListJs.get(i + "").getAsJsonObject().get("period").getAsInt() + 1;

			}

			// 각 지표마다 쓰이는 '기간'이 다르므로, tempPeriod를 통해 해당 지표가 사용하는 기간을 비교
			// period가 제일 긴 지표를 이용
			if (maxPeriod < tempPeriod) {
				maxPeriod = tempPeriod;
			}
		}

		// 시작, 종료 시간을 유닉스타임으로 변환
		LocalDateTime startD = LocalDateTime.parse(startDate);
		LocalDateTime endD = LocalDateTime.parse(endDate);

		ZoneId zoneId = ZoneId.systemDefault();
		// 시작 시간 - maxPeriod 부터 데이터를 받아옴.
		long startUnix = startD.atZone(zoneId).toEpochSecond() - (maxPeriod * interval);
		long endUnix = endD.atZone(zoneId).toEpochSecond();
		double[][] hHLCVArr;

		try {
			// 앞서 언급한 '큰 데이터'
			hHLCVArr = IndicatorFunction_bt.get_HLCV_HistoryArray(exchange, coin, base, interval, startUnix, endUnix);
		} catch (Exception e) {
			System.out.println("초기에러 : 데이터 불러오기 실패");
			return "dataLoadFail";
		}

		// -- !! 지표 객체 생성 파트 !! --//
		SimpleDateFormat dt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		// 배열에다가 해당하는 지표 객체 담기 (각각 개별 파라미터 및 웨이트 적용)
		for (int i = 0; i < indicatorListJs.size(); i++) {
			String indexOrder = i + "";
			String indicator = indicatorListJs.get(indexOrder).getAsJsonObject().get("indicator").getAsString();
			int weight = indicatorListJs.get(indexOrder).getAsJsonObject().get("weight").getAsInt();
			weightList[i] = weight;

			try {
				if (indicator.equals("BollingerBand")) {
					int period = indicatorListJs.get(indexOrder).getAsJsonObject().get("period").getAsInt();
					int mul = indicatorListJs.get(indexOrder).getAsJsonObject().get("mul").getAsInt();

					indicatorCalcer[i] = new BollingerBand_bt(period, mul, crypt, exchange, coin, base, interval,
							hHLCVArr, maxPeriod - period, maxPeriod - 1);
				} else if (indicator.equals("CCI")) {

					int period = indicatorListJs.get(indexOrder).getAsJsonObject().get("period").getAsInt();
					int buyIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("buyIndex").getAsInt();
					int sellIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("sellIndex").getAsInt();

					indicatorCalcer[i] = new CommodityChannelIndex_bt(period, buyIndex, sellIndex, crypt, exchange,
							coin, base, interval, hHLCVArr, maxPeriod - (period + period - 1), maxPeriod - 1);
				} else if (indicator.equals("gdCross")) {

					int longd = indicatorListJs.get(indexOrder).getAsJsonObject().get("longD").getAsInt();
					int shortd = indicatorListJs.get(indexOrder).getAsJsonObject().get("shortD").getAsInt();
					int mT = indicatorListJs.get(indexOrder).getAsJsonObject().get("mT").getAsInt();

					indicatorCalcer[i] = new gdCross_bt(longd, shortd, mT, crypt, exchange, coin, base, interval,
							hHLCVArr, maxPeriod - longd, maxPeriod - 1);
				} else if (indicator.equals("gdVCross")) {

					int longd = indicatorListJs.get(indexOrder).getAsJsonObject().get("longD").getAsInt();
					int shortd = indicatorListJs.get(indexOrder).getAsJsonObject().get("shortD").getAsInt();
					int mT = indicatorListJs.get(indexOrder).getAsJsonObject().get("mT").getAsInt();

					indicatorCalcer[i] = new gdVCross_bt(longd, shortd, mT, crypt, exchange, coin, base, interval,
							hHLCVArr, maxPeriod - longd, maxPeriod - 1);
				} else if (indicator.equals("MFI")) {

					int period = indicatorListJs.get(indexOrder).getAsJsonObject().get("period").getAsInt();
					int buyIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("buyIndex").getAsInt();
					int sellIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("sellIndex").getAsInt();

					indicatorCalcer[i] = new MFI_bt(period, buyIndex, sellIndex, crypt, exchange, coin, base, interval,
							hHLCVArr, maxPeriod - (period + 1), maxPeriod - 1);
				} else if (indicator.equals("StochOsc")) {

					int n = indicatorListJs.get(indexOrder).getAsJsonObject().get("n").getAsInt();
					int m = indicatorListJs.get(indexOrder).getAsJsonObject().get("m").getAsInt();
					int t = indicatorListJs.get(indexOrder).getAsJsonObject().get("t").getAsInt();

					indicatorCalcer[i] = new StochasticOsillator_bt(n, m, t, crypt, exchange, coin, base, interval,
							hHLCVArr, maxPeriod - (n + m + t - 2), maxPeriod - 1);
				} else if (indicator.equals("VolumeRatio")) {

					int period = indicatorListJs.get(indexOrder).getAsJsonObject().get("period").getAsInt();
					int buyIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("buyIndex").getAsInt();
					int sellIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("sellIndex").getAsInt();

					indicatorCalcer[i] = new VolumeRatio_bt(period, buyIndex, sellIndex, crypt, exchange, coin, base,
							interval, hHLCVArr, maxPeriod - (period + 1), maxPeriod - 1);
				} else if (indicator.equals("RSI")) {

					int period = indicatorListJs.get(indexOrder).getAsJsonObject().get("period").getAsInt();
					int buyIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("buyIndex").getAsInt();
					int sellIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("sellIndex").getAsInt();

					indicatorCalcer[i] = new RSI_bt(period, buyIndex, sellIndex, crypt, exchange, coin, base, interval,
							hHLCVArr, maxPeriod - (period + 1), maxPeriod - 1);
				}
			} catch (Exception e) {
				/////////////////////////////////// ERROR
				System.out.println("error ! - 초기 지표 객체 생성 중 오류 : " + LocalDate.now());
				e.printStackTrace();
				returnMessage += "초기 에러 : 종료\n";
				return "dataLoadFail";
			}
		}

		// // // // // // // // // // // 테스팅 루프 시작!!

		int cnt = 1; // returnMessage에 출력을 위한 카운팅 변수

		// 시작이 maxPeriod인 이유 -> 지표 객체 생성하는 타이밍이 maxPeiord-1 인 셈.
		// 따라서 maxPeriod부터 시작을 해야
		// 지표의 움직임을 포착할 수 있음. (순간의 상태로는 지표의 움직임을 포착하지 못함)
		for (int i = maxPeriod; i < hHLCVArr.length; i++) {

			returnDetailMessage += (cnt++) + " th trade\n";
			double fin;
			Date date;
			try {
				fin = (getFinDeter(indicatorCalcer, expList, weightList));
				date = new Date();
				date.setTime((long) hHLCVArr[i][4] * 1000);
				returnDetailMessage += "시간 : " + date + "\n";
				returnDetailMessage += "가중치 계산 결과 : " + fin + "\n";
				
			} catch (Exception e) {
				// getFinDeter 에러일 확률이 높음
				returnDetailMessage += "가중치 결정 값을 구하는 도중 일어난  error ! : " + LocalDate.now() +"\n";
				returnMessage += "가중치 결정 값을 구하는 도중 일어난 error ! : " + LocalDate.now() +"\n";
				resultLog.addProperty("status", "fail");
				resultLog.addProperty("error", "가중치 결정 값을 구하는 도중 일어난 오류" + LocalDate.now());
				e.printStackTrace();
				return resultLog.getAsString();
			}
			
			// h : history
			// H : High 0
			// L : Low 1
			// C : Close 2
			// V : Volume 3
			// 현재 가격은 종가를 사용
			double currentPrice = hHLCVArr[i][2];

			// 지표의 생성 값이 구매 기준치 보다 크다면
			if (fin > buyCriteria) {

				// 사야할 코인의 갯수 (최종)
				double finCoinToBuy = 0;

				// 현재 캐쉬가 0 이상이면
				if (nowCash > 0) {
					if (buyingSetting.equals("buyAll")) {
						// 전부 구매
						double coinToBuy = nowCash / currentPrice;
						finCoinToBuy = coinToBuy;
						nowCoin += coinToBuy;
						nowCash = 0;
					} else if (buyingSetting.equals("buyCertainPrice")) {
						
						// 일정 가격 구매
						if (nowCash > priceBuyUnit) {
							double coinToBuy = priceBuyUnit / currentPrice;
							finCoinToBuy = coinToBuy;
							nowCoin += coinToBuy;
							nowCash -= priceBuyUnit;
						} else {

							returnMessage += date + "\n" + "일정가 구매 - fail : 잔액부족" + "\n";
							returnDetailMessage += "일정가 구매 - fail : 잔액부족\n";
							continue;
						}
					} else {
						// buyCertainNumber 일정갯수구입
						if (nowCash > numBuyUnit * currentPrice) {
							finCoinToBuy = numBuyUnit;
							nowCoin += numBuyUnit;
							nowCash -= currentPrice * numBuyUnit;
						} else {
							
							returnMessage += date + "\n" + "일정수 구매 - fail : 잔액부족" + "\n";
							returnDetailMessage += "일정수 구매 - fail : 잔액부족\n";
							continue;
						}
					}

					String temp = String.format("구매! 현재 현금자산 보유량 : %s / 현재 코인 보유량 : %s / 현재 총 자산 : %s", (long) nowCash,
							(long) nowCoin, (long) (nowCoin * currentPrice + nowCash));
					returnMessage += date + "\n" + temp + "\n";

					// 시간, 행동, 코인 가격, 수량, 현금, 코인수, 성공여부
					JsonObject tempJob = new JsonObject();
					tempJob.addProperty("time", dt.format(date));
					tempJob.addProperty("saleAction", "매수");
					tempJob.addProperty("coinCurrentPrice", String.format("%.4f", currentPrice));
					tempJob.addProperty("salingCoinNumber", String.format("%.4f", finCoinToBuy));
					tempJob.addProperty("nowCash", String.format("%.4f", nowCash));
					tempJob.addProperty("nowCoin", String.format("%.4f", nowCoin));
					resultLogArr.add(tempJob);

					returnDetailMessage += temp + "\n";
				}

				// 돈 없을 때
				else {

					returnMessage += date + "\n구매 - no money!" + "\n";
					returnDetailMessage += "\n구매 - no money!" + "\n";
				}
				returnMessage += "--------------------------------------------------------------\n";
			}

			// fin이 판매기준치 보다 낮으면 판매
			// 구매와 다를게 없음
			else if (fin < sellCriteria) {

				double finCoinToSell = 0;

				if (nowCoin > 0) {

					if (sellingSetting.equals("sellAll")) {

						finCoinToSell = nowCoin;
						nowCash += nowCoin * currentPrice;
						nowCoin = 0;
					}

					else if (sellingSetting.equals("sellCertainPrice")) {

						if (nowCoin >= priceSellUnit / currentPrice) {
							nowCash += priceSellUnit;
							double coinToSell = priceSellUnit / currentPrice;
							nowCoin -= coinToSell;
							finCoinToSell = coinToSell;

						} else {

							returnMessage += "일정가 판매 - fail : 코인부족" + "\n";
							returnDetailMessage += "일정가 판매 - fail : 코인부족" + "\n";
							
							continue;
						}

					}

					else {
						// 일정갯수판매
						if (nowCoin >= numSellUnit) {
							finCoinToSell = numSellUnit;
							nowCoin -= numSellUnit;
							nowCash += numSellUnit * currentPrice;
						
						} else {
							returnMessage += "일정수 판매 - fail : 코인부족" + "\n";
							returnDetailMessage += "일정수 판매 - fail : 코인부족\n";

							continue;
						}
					}

					String temp = String.format("판매! 현재 현금자산 보유량 : %s / 현재 코인 보유량 : %s / 현재 총 자산 : %s", (long) nowCash,
							(long) nowCoin, (long) (nowCoin * currentPrice + nowCash));
					returnMessage += date + "\n" + temp + "\n";
					returnDetailMessage += temp + "\n";

					// 시간, 행동, 코인 가격, 수량, 현금, 코인수, 성공여부
					JsonObject tempJob = new JsonObject();
					tempJob.addProperty("time", dt.format(date));
					tempJob.addProperty("saleAction", "매도");
					tempJob.addProperty("coinCurrentPrice", String.format("%.4f", currentPrice));
					tempJob.addProperty("salingCoinNumber", String.format("%.4f", finCoinToSell));
					tempJob.addProperty("nowCash", String.format("%.4f", nowCash));
					tempJob.addProperty("nowCoin", String.format("%.4f", nowCoin));
					resultLogArr.add(tempJob);

				} 
				// 코인이 없음
				else {
					returnMessage += date + "\n판매 - no coin!" + "\n";
					returnDetailMessage += "판매 - no coin!" + "\n";
				}

				returnMessage += "--------------------------------------------------------------\n";
				
			} else {
				// 대기 ( sellCriteria < fin < buyCriteria인 상황
				returnDetailMessage += "대기!\n";
			}
			returnDetailMessage += "--------------------------------------------------------------\n";
		}

		System.out.println("\n		<<결과>>\n" + returnMessage);
		System.out.println("\n		<<상세결과>>\n" + returnDetailMessage);

		// 결과 처리
		// 최종 자산 = 최종 코인 갯수 * 코인 최종가 + 최종 현금
		double finalAsset = (hHLCVArr[hHLCVArr.length - 1][2] * nowCoin + nowCash);
		//수익률
		double profit = ((finalAsset - initialCash) / initialCash);
		System.out.println(finalAsset + " / 시작금액 : " + initialCash);

		String returnResult = "최종 코인 : " + nowCoin + " / 최종 금액 : " + nowCash + " / 최종 자산 : " + finalAsset + " / 수익률 : "
				+ profit * 100;
		System.out.println(returnResult);

		JsonObject finResult = new JsonObject();
		finResult.addProperty("finalCoin", String.format("%.4f", nowCoin));
		finResult.addProperty("nowCash", String.format("%.4f", nowCash));
		finResult.addProperty("finalAsset", String.format("%.4f", finalAsset));
		finResult.addProperty("finalProfit", String.format("%.2f", profit * 100));

		resultLog.addProperty("status", "성공");
		resultLog.add("result", finResult);
		resultLog.addProperty("error", "");
		resultLog.add("log", resultLogArr);
		resultLog.addProperty("base", base.toUpperCase());

		return resultLog.toString();
		// System.out.println("---결과---\n" + returnMessage);
	}

	// 사용되지 않음
	private double getFinalDetermin(Stack<String> post) {

		// 현재 스택이 abc++식으로 되어있으므로
		// 뒤집어서 ++cba식으로 바꿔준다
		// pop을 하면 맨 뒤(a)부터 빠져나오기 때문!
		Stack<String> tempStk = new Stack<String>();

		int postSize = post.size();
		for (int i = 0; i < postSize; i++) {
			tempStk.push(post.pop());
		}

		// 계산스택
		// 연산자를 만나면 두개를 팝해서 연산한 뒤 다시 푸쉬
		Stack<String> calStk = new Stack<String>();
		int size = tempStk.size();
		for (int i = 0; i < size; i++) {

			String poped = tempStk.pop();

			if (poped.equals("or")) {

				String temp1 = calStk.pop();
				String temp2 = calStk.pop();

				int ret = Integer.parseInt(temp1) + Integer.parseInt(temp2);
				calStk.push(ret + "");
			} else if (poped.equals("and")) {
				String temp1 = calStk.pop();
				String temp2 = calStk.pop();

				int ret = Integer.parseInt(temp1) * Integer.parseInt(temp2);
				calStk.push(ret + "");
			} else {
				calStk.push(poped);
			}
		}
		return Double.parseDouble(calStk.pop());
	}

	private double getFinDeter(calcIndicator_bt[] indicatorCalcer, String[] expList, int[] weightList) throws Exception {

	
		// 피연산자인 지표를 배열로 가지고 있는 상태.
		// 각 지표객체에 getDeterminConstant(지표 생성 시그널 값)을 실행하여
		// 0, -1, 1 중 하나를 받음.
		double ret = 0;
		for (int i = 0; i < indicatorCalcer.length; i++) {

			double temp = indicatorCalcer[i].getDeterminConstant() * weightList[i];
			ret += temp * weightList[i]; // 가중치를 결과값에 곱하여 플러스
			returnDetailMessage += indicatorCalcer[i].toString().split("@")[0] + " : " + temp + "\n";
		}
		return ret;
	}
}
