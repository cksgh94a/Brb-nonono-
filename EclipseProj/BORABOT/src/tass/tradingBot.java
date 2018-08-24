package tass;

import exchangeAPI.*;
import Indicator.*;
import backtest.calcIndicator_bt;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Stack;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.Date;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import DB.DB;

import java.sql.*;

public class tradingBot {

	private String API_KEY;
	private String Secret_KEY;

	// From frontend
	private String exchange;
	private String coin;
	private String base;
	private int interval;
	private String botName;
	private String email;
	private String strategyName;
	private String buyingSetting;
	private String sellingSetting;
	private String startDate; // 일단 가지고만 있기
	private String endDate; // 루프 탈출 요소

	// 1 : 대기 , 0 : 종료 -> 어드민쪽 설정, 0 mandatory
	private int errorHandling;

	// optional
	private double priceBuyUnit;
	private double numBuyUnit;
	private double priceSellUnit;
	private double numSellUnit;

	// 디비 strategy에서 뽑아오는 부분
	private double buyCriteria;
	private double sellCriteria;

	public tradingBot(String email, String exchange, String botName, String coin, String base, int interval,
			String startDate, String endDate, String strategyName, String buyingSetting, String sellingSetting,
			double priceBuyUnit, double priceSellUnit, double numBuyUnit, double numSellUnit, int error) {

		this.exchange = exchange;
		this.coin = coin;
		this.base = base;
		this.interval = interval;
		this.botName = botName;
		this.email = email;
		this.strategyName = strategyName;
		this.buyingSetting = buyingSetting;
		this.sellingSetting = sellingSetting;
		this.priceBuyUnit = priceBuyUnit;
		this.priceSellUnit = priceSellUnit;
		this.numBuyUnit = numBuyUnit;
		this.numSellUnit = numSellUnit;
		this.startDate = startDate;
		this.endDate = endDate;
		this.errorHandling = error;
	}

	private CryptowatchAPI crypt = new CryptowatchAPI(20, 60);

	public void botStart() throws SQLException {

		/* DB에서 API Sec 키 가지고오기 */

		String KeySQL = String.format(
				"Select api_key, secret_key from customer_key where email = '%s' and exchange_name = '%s'", email,
				exchange);
		DB dbkey = new DB();
		ResultSet rsKey = dbkey.Query(KeySQL, "select");

		String apiKey = "";
		String secKey = "";
		try {
			if (rsKey.next()) {
				apiKey = rsKey.getString(1);
				secKey = rsKey.getString(2);
			} else {
				System.out.println("등록된 API 키 없음");
				return; // 종료 및 앞단에 메세지.
			}
		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		dbkey.clean();

		final exAPI exAPIobj;

		if (exchange.equals("bithumb") || exchange.equals("BITHUMB")) {
			exAPIobj = (exAPI) new BithumbAPI(apiKey, secKey);
		} else if (exchange.equals("binance") || exchange.equals("BINANCE")) {
			exAPIobj = (exAPI) new BinanceAPI(apiKey, secKey, 10, 10);
		} else if (exchange.equals("hitbtc") || exchange.equals("HITBTC")) {
			exAPIobj = (exAPI) new HitbtcAPI(apiKey, secKey);
		} else {
			System.out.println("API 객체 생성 오류!");
			return;
		}

		// 초기에 현재 거래소의 자산과 코인 정보를 api call!
		// getBalance는 apikey관련 api호출에 오류가 있으면 -1을 리턴함
		double initialCoinNum = exAPIobj.getBalance(coin.toLowerCase());
		double initialBalance = exAPIobj.getBalance(base.toLowerCase());

		if (initialCoinNum == -1 || initialBalance == -1) {

			// api key 오류( 높은 확률로 invalidKey )
			System.out.println("api key 오류 ! " + initialCoinNum);
			return;
		}

		// trade DB insert!
		// 초기 진행 상태 = 1(시작) / 초기 최종자산 = -1으로 표시(null)
		DB dao = new DB();
		String initialTradeSql = String.format(
				" INSERT INTO trade VALUES( \"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%s,\"%s\",\"%s\",\"%s\",\"%s\",%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s )",
				email, botName, exchange, coin, base, strategyName, interval, startDate, endDate, buyingSetting,
				sellingSetting, priceBuyUnit, priceSellUnit, numBuyUnit, numSellUnit, buyCriteria, sellCriteria, 1,
				initialBalance, initialCoinNum, -1, -1, -1);
		dao.Query(initialTradeSql, "insert");
		dao.clean();

		// custom_strategy에서 개인별 전략을 select (JSON)
		String settingSelectSql = String.format(
				"SELECT strategy_content FROM custom_strategy WHERE email = \"%s\" and strategy_name = \"%s\"; ", email,
				strategyName);
		String strategySettingJson = "";
		try {
			ResultSet rsTemp = dao.Query(settingSelectSql, "select");
			if (rsTemp.next()) {
				strategySettingJson = rsTemp.getString(1);
			}
			dao.clean();
		} catch (Exception e) {
			e.printStackTrace();
		}

		System.out.println("test" + strategySettingJson);

		JsonParser parser = new JsonParser();
		JsonElement element = parser.parse(strategySettingJson);
		JsonObject jsnObj = element.getAsJsonObject();

		buyCriteria = jsnObj.get("buyCriteria").getAsInt();
		sellCriteria = jsnObj.get("sellCriteria").getAsInt();
		String expList[] = jsnObj.get("expList").getAsString().split(",");

		JsonObject indicatorListJs = jsnObj.get("indicatorList").getAsJsonObject();
		calcIndicator[] indicatorCalcer = new calcIndicator[indicatorListJs.size()];
		int weightList[] = new int[indicatorListJs.size()];

		// 배열에다가 해당하는 지표 객체 담기 (각각 개별 파라미터 파싱)
		for (int i = 0; i < indicatorListJs.size(); i++) {
			String indexOrder = i + "";
			String indicator = indicatorListJs.get(indexOrder).getAsJsonObject().get("indicator").getAsString();
			int weight = indicatorListJs.get(indexOrder).getAsJsonObject().get("weight").getAsInt();
			weightList[i] = weight;
			
			try {
				if (indicator.equals("BollingerBand")) {
					int period = indicatorListJs.get(indexOrder).getAsJsonObject().get("period").getAsInt();
					int mul = indicatorListJs.get(indexOrder).getAsJsonObject().get("mul").getAsInt();

					indicatorCalcer[i] = new BollingerBand(period, mul, crypt, exchange, coin, base, interval);
				} else if (indicator.equals("CCI")) {

					int period = indicatorListJs.get(indexOrder).getAsJsonObject().get("period").getAsInt();
					int buyIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("buyIndex").getAsInt();
					int sellIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("sellIndex").getAsInt();

					indicatorCalcer[i] = new CommodityChannelIndex(period, buyIndex, sellIndex, crypt, exchange, coin,
							base, interval);

				} else if (indicator.equals("gdCross")) {

					int longd = indicatorListJs.get(indexOrder).getAsJsonObject().get("longD").getAsInt();
					int shortd = indicatorListJs.get(indexOrder).getAsJsonObject().get("shortD").getAsInt();
					int mT = indicatorListJs.get(indexOrder).getAsJsonObject().get("mT").getAsInt();

					indicatorCalcer[i] = new gdCross(longd, shortd, mT, crypt, exchange, coin, base, interval);
				} else if (indicator.equals("gdVCross")) {

					int longd = indicatorListJs.get(indexOrder).getAsJsonObject().get("longD").getAsInt();
					int shortd = indicatorListJs.get(indexOrder).getAsJsonObject().get("shortD").getAsInt();
					int mT = indicatorListJs.get(indexOrder).getAsJsonObject().get("mT").getAsInt();

					indicatorCalcer[i] = new gdVCross(longd, shortd, mT, crypt, exchange, coin, base, interval);
				} else if (indicator.equals("MFI")) {

					int period = indicatorListJs.get(indexOrder).getAsJsonObject().get("period").getAsInt();
					int buyIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("buyIndex").getAsInt();
					int sellIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("sellIndex").getAsInt();

					indicatorCalcer[i] = new MFI(period, buyIndex, sellIndex, crypt, exchange, coin, base, interval);
				} else if (indicator.equals("StochOsc")) {

					int n = indicatorListJs.get(indexOrder).getAsJsonObject().get("n").getAsInt();
					int m = indicatorListJs.get(indexOrder).getAsJsonObject().get("m").getAsInt();
					int t = indicatorListJs.get(indexOrder).getAsJsonObject().get("t").getAsInt();

					indicatorCalcer[i] = new StochasticOsillator(n, m, t, crypt, exchange, coin, base, interval);
				} else if (indicator.equals("VolumeRatio")) {

					int period = indicatorListJs.get(indexOrder).getAsJsonObject().get("period").getAsInt();
					int buyIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("buyIndex").getAsInt();
					int sellIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("sellIndex").getAsInt();

					indicatorCalcer[i] = new VolumeRatio(period, buyIndex, sellIndex, crypt, exchange, coin, base,
							interval);
				} else if (indicator.equals("RSI")) {

					int period = indicatorListJs.get(indexOrder).getAsJsonObject().get("period").getAsInt();
					int buyIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("buyIndex").getAsInt();
					int sellIndex = indicatorListJs.get(indexOrder).getAsJsonObject().get("sellIndex").getAsInt();

					indicatorCalcer[i] = new RSI(period, buyIndex, sellIndex, crypt, exchange, coin, base, interval);
				}
			} catch (Exception e) {
				/////////////////////////////////// ERROR//////////////////////////////////////////
				e.printStackTrace();
				System.out.println("지표 객체 생성 도중 발생한 오류 : " + LocalDate.now());
				if (errorHandling == 1) {
					// 대기
					try {
						Thread.sleep(interval / 10 * 1000);
						i--;
						continue;
					} catch (Exception e3) {
						System.out.println("first initializing error -> sleep -> error");
					}
				} else {
					// 종료
					// timer를 실행하기 이전에 그냥 리턴해버리므로 그냥 봇이 종료 
					// status 상태 0으로 전환 , trans_log는 X
					String sql = String.format("UPDATE trade SET status=0 WHERE email = \"%s\" and bot_name = \"%s\" ",
							email, botName);
					dao.Query(sql, "insert");
					dao.clean();
					// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ봇 종료 알람 메일ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
					String content = LocalDateTime.now() + "\n보라봇 " + botName + " 이 초기 오류로 종료되었습니다.";
					String subject = "보라봇 " + botName + " 종료 알람";
					SendMail.sendEmail(email, subject, content);
					return;// 종료
				}
			}
		}
		System.out.println(botName + "bot sale setting is done");
		// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ//
		// 스레드 부분!
		Timer timer = new Timer();

		TimerTask task = new TimerTask() {
			@Override
			public void run() {

				int trigger = 1;

				// 시간 체크 //
				LocalDateTime now = LocalDateTime.now();
				LocalDateTime deadDay = LocalDateTime.parse(endDate);

				double numOfNowCoin = exAPIobj.getBalance(coin.toLowerCase());
				double balanceOfNow = exAPIobj.getBalance(base.toLowerCase());

				// 시간 초과 종료
				if (now.isAfter(deadDay)) {

					// ---module---//
					double ticker = exAPIobj.getTicker(coin, base);
					double total = numOfNowCoin * ticker + balanceOfNow;

					String sql = String.format(
							"UPDATE trade SET status=0, last_asset = %s, last_coin_number = %s, last_balance = %s WHERE email = \"%s\" and bot_name = \"%s\" ",
							total, numOfNowCoin, balanceOfNow, email, botName);
					try {
						dao.Query(sql, "insert");
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					dao.clean();
					// ---module---//

					// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ봇 종료 알람ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
					String content = LocalDateTime.now() + "\n보라봇 " + botName + " 이 거래기간 만료로 종료되었습니다.";
					String subject = "보라봇 " + botName + " 종료 알람";
					SendMail.sendEmail(email, subject, content);

					System.out.println("trade is done : day expired");

					timer.cancel();
					this.cancel();
					trigger = -1;
				}

				// status 체크 //
				String tradeSQL = String.format("SELECT status FROM trade WHERE email = \"%s\" and bot_name = \"%s\" ",
						email, botName);
				String nowStatus = "";

				try {
					ResultSet rsTemp = dao.Query(tradeSQL, "select");

					if (rsTemp.next()) {
						nowStatus = rsTemp.getString(1);
					}
					dao.clean();
				} catch (Exception e) {
					System.out.println("스테이터스를 구하는 도중 일어난 오류");
					e.printStackTrace();
				}

				// status가 0이면 종료 강제종료
				if (nowStatus.equals("0")) {
					// 종료

					// ---module---//
					double ticker = exAPIobj.getTicker(coin, base);
					double total = numOfNowCoin * ticker + balanceOfNow;

					String sql = String.format(
							"UPDATE trade SET status=0, last_asset = %s, last_coin_number = %s, last_balance = %s WHERE email = \"%s\" and bot_name = \"%s\" ",
							total, numOfNowCoin, balanceOfNow, email, botName);
					try {
						dao.Query(sql, "insert");
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					dao.clean();
					// ---module---//

					// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ봇 종료 알람ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
					String content = LocalDateTime.now() + "\n보라봇 " + botName + " 이 사용자 선택으로 종료되었습니다.";
					String subject = "보라봇 " + botName + " 종료 알람";
					SendMail.sendEmail(email, subject, content);

					String sqlTemp = String.format(
							"update customer set alarm_count_unread = alarm_count_unread+1 where email = \"%s\" ",
							email);
					DB dbt = new DB();
					try {
						dbt.Query(sqlTemp, "insert");
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					dbt.clean();

					System.out.println("trade is done : teminated by forced");
					timer.cancel();
					this.cancel();
					trigger = -1;
				}

				// 1차관문 : dao에 상태가 진행중이거나, 날짜가 아직 안지났거나 둘 다 만족하면 거래진행!
				if (trigger == 1) {
					double fin;

					try {
						fin = (getFinDeter(indicatorCalcer, expList, weightList));
						System.out.println("result : " + fin);

					} catch (Exception e) {
						// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡCW or ExchangeAPI err알람ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ//
						// 종료 ? 컨티뉴?
						System.out.println("2 error ! : " + LocalDate.now());
						System.out.println("FianlDetermin을 구하는 도중 일어난 에러! - cw나 exapi문제일 확률!");
						e.printStackTrace();
						fin = -1; // meaningless

						if (errorHandling == 1) {
							System.out.println("FinalDetermin error ! - waiting!");
							try {
								Thread.sleep(interval / 10 * 1000);
							} catch (Exception e2) {
								System.out.println("스레드 슬립 에러 ! ");
							}
							trigger = -1;
							run();
							return;
						} else if (errorHandling == 0) {
							// 종료
							// sql update status = 0;

							// ---module---//
							double ticker = exAPIobj.getTicker(coin, base);
							// double numOfNowCoin = exAPIobj.getBalance(coin);
							// double balanceOfNow = exAPIobj.getBalance(base);
							double total = numOfNowCoin * ticker + balanceOfNow;

							String sql = String.format(
									"UPDATE trade SET status=0, last_asset = %s, last_coin_number = %s, last_balance = %s WHERE email = \"%s\" and bot_name = \"%s\" ",
									total, numOfNowCoin, balanceOfNow, email, botName);
							try {
								dao.Query(sql, "insert");
							} catch (SQLException e1) {
								// TODO Auto-generated catch block
								e1.printStackTrace();
							}
							dao.clean();
							// ---module---//

							// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ봇 종료 알람ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
							String content = LocalDateTime.now() + "\n보라봇 " + botName + " 이 거래 중 데이터 api 오류로 종료되었습니다.";
							String subject = "보라봇 " + botName + " 종료 알람";
							SendMail.sendEmail(email, subject, content);

							String sqlTemp = String.format(
									"update customer set alarm_count_unread = alarm_count_unread+1 where email = \"%s\" ",
									email);
							DB dbt = new DB();
							try {
								dbt.Query(sqlTemp, "insert");
							} catch (SQLException e1) {
								// TODO Auto-generated catch block
								e1.printStackTrace();
							}
							dbt.clean();
							// timer cancel을 해도 최초 1회는 실행되므로, 그걸 막기 위해 트리거를 별도 설정
							// 사용자가 봇 시작을 누른 뒤 직후에 취소하는 경우를 대비
							trigger = -1; 
							fin = -1; // meaningless
							timer.cancel(); // 이후에 작업 X : 종료
						}
					}

					// 2차관문 : FinalDetermin을 구하는데 에러가 나면 이 trigger로 뒤에 코드는 실행 X
					if (trigger == 1) {
						if (fin > buyCriteria) {
							System.out.println("buy!");

							double numOfSalingCoin;

							if (buyingSetting.equals("buyAll")) {

								numOfSalingCoin = buyAll(exAPIobj, balanceOfNow);

							} else if (buyingSetting.equals("buyCertainPrice")) {

								numOfSalingCoin = buyCertainPrice(exAPIobj, priceBuyUnit, balanceOfNow);
							} else {

								numOfSalingCoin = buyCertainNum(exAPIobj, numBuyUnit, balanceOfNow);
							}

							numOfSalingCoin = shapingnumOfSalingCoin(numOfSalingCoin, coin);

							// try {
							// exAPIobj.buyCoin(coin, base, numOfSalingCoin + "");
							// } catch (Exception e) {
							// // 매도 시그널 보냈 지만 실패
							// // 이유
							// // 1. 서버 오류
							// // 2. 잔액 부족?
							// // 3. 코인 부족
							// // 4. 소숫점 단위 안 맞음.
							//
							// }

							double ticker = exAPIobj.getTicker(coin, base);
							double total = numOfNowCoin * ticker + balanceOfNow;

							String currentTime = LocalDateTime.now().toString();

							String sql = String.format(
									"INSERT INTO trans_log VALUES(\"%s\", \"%s\", \"%s\", \"%s\", %s, \"%s\", \"%s\", %s, %s, %s, %s, 0)",
									email, botName, exchange, currentTime, 1, coin + base, ticker, numOfSalingCoin,
									total, balanceOfNow, numOfNowCoin, 0); // 마지막 0 -> 안읽음

							System.out.println(sql);
							try {
								dao.Query(sql, "insert");
							} catch (SQLException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							dao.clean();
							// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡsendAlarm : 구매 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ//
							// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ알람내용 디비에 저장ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ//
							String subject = "보라봇 " + botName + " 구매 알람!";
							String content = String.format(
									"%s \n %s봇이 코인 %s 을 %s개 시장가로 매수주문 보냈습니다. 현재 코인 : %s , 현재 잔액 : %s", botName,
									LocalDateTime.now(), coin, numOfSalingCoin, numOfNowCoin, balanceOfNow);
							SendMail.sendEmail(email, subject, content);

							String sqlTemp = String.format(
									"update customer set alarm_count_unread = alarm_count_unread+1 where email = \"%s\" ",
									email);
							DB dbt = new DB();
							try {
								dbt.Query(sqlTemp, "insert");
							} catch (SQLException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							dbt.clean();

						} else if (fin < sellCriteria) { // 매도 시그널!
							System.out.println("sell!");

							double numOfSalingCoin;

							if (sellingSetting.equals("sellAll")) {

								numOfSalingCoin = sellAll(numOfNowCoin);
							} else if (sellingSetting.equals("sellCertainPrice")) {

								numOfSalingCoin = sellCertainPrice(exAPIobj, priceSellUnit, numOfNowCoin);
							} else {

								numOfSalingCoin = sellCertainNum(exAPIobj, numSellUnit, numOfNowCoin);
							}

							numOfSalingCoin = shapingnumOfSalingCoin(numOfSalingCoin, coin);

							// try {
							// exAPIobj.sellCoin(coin, base, numOfSalingCoin + "");
							// } catch (Exception e) {
							// // 매도 시그널 보냈 지만 실패
							// // 이유
							// // 1. 서버 오류
							// // 2. 잔액 부족?
							// // 3. 코인 부족
							// // 4. 소숫점 단위 안 맞음.
							//
							// }

							double ticker = exAPIobj.getTicker(coin, base);
							double total = numOfNowCoin * ticker + balanceOfNow;

							String currentTime = LocalDateTime.now().toString();

							String sql = String.format(
									"INSERT INTO trans_log VALUES(\"%s\", \"%s\", \"%s\", \"%s\", %s, \"%s\", \"%s\", %s, %s, %s, %s, 0)",
									email, botName, exchange, currentTime, -1, coin + base, ticker, numOfSalingCoin,
									total, balanceOfNow, numOfNowCoin, 0);
							System.out.println(sql);
							try {
								dao.Query(sql, "insert");
							} catch (SQLException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							dao.clean();
							// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡsendAlarm : 판매 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ//
							// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ알람내용 디비에 저장ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ//
							String subject = "보라봇 " + botName + " 판매 알람!";
							String content = String.format(
									"%s \n %s봇이 코인 %s 을 %s개 시장가로 매도주문을 보냈습니다. 현재 코인 : %s , 현재 잔액 : %s", botName,
									LocalDateTime.now(), coin, numOfSalingCoin, numOfNowCoin, balanceOfNow);
							SendMail.sendEmail(email, subject, content);

							String sqlTemp = String.format(
									"update customer set alarm_count_unread = alarm_count_unread+1 where email = \"%s\" ",
									email);
							DB dbt = new DB();
							try {
								dbt.Query(sqlTemp, "insert");
							} catch (SQLException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							dbt.clean();

						} else {
							System.out.println("wait!");
							double ticker = exAPIobj.getTicker(coin, base);
							// double numOfNowCoin = exAPIobj.getBalance(coin);
							// double balanceOfNow = exAPIobj.getBalance(base);
							double total = numOfNowCoin * ticker + balanceOfNow;
							String currentTime = LocalDateTime.now().toString();

							String sql = String.format(
									"INSERT INTO trans_log VALUES(\"%s\", \"%s\", \"%s\", \"%s\", %s, \"%s\", \"%s\", %s, %s, %s, %s, 0)",
									email, botName, exchange, currentTime, 0, coin + base, ticker, 0, total,
									balanceOfNow, numOfNowCoin, 0);
							System.out.println(sql);
							try {
								dao.Query(sql, "insert");
							} catch (SQLException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							dao.clean();

						}
						System.out.println("\n");
					}
				}
			}
		};

		// 거래 시작!!
		Date date = new Date();
		date.setTime(System.currentTimeMillis() + (interval * 1000));
		/*
		 * date + interval = 시작하는 시간(현재, 클릭 시간) 더하기 거래 간격 1단위 만큼 후에 실행이 됨.
		 * 미리 지표 객체륻을 생성할 때 전 상태를 저장하는 것과 관련
		 */
		timer.scheduleAtFixedRate(task, date, interval * 1000);
	

	}

	
	private double shapingnumOfSalingCoin(double numOfSalingCoin, String coin) {

		// 소수점이 너무 길어지면 거래소에서 api콜을 받지 않을 것
		
		if (coin.equals("XRP") || coin.equals("xrp")) {
			// 리플의 경우 거래소에 지원하는 소수점이 대부분 6자리인 것으로 보임.
			double ret = Double.parseDouble(String.format("%.6f", numOfSalingCoin));
			return ret;
		} else {
			// 나머지 코인은 8자리로
			double ret = Double.parseDouble(String.format("%.8f", numOfSalingCoin));
			return ret;
		}
	}

	// 올인선택 - 가지고 있는 돈으로 살 수 있느 모든 코인을 사버림
	private double buyAll(exAPI api, double balanceOfNow) {

		return balanceOfNow / api.getTicker(coin, base);
	}

	// 특정 가격 만큼 산다고 정하면
	private double buyCertainPrice(exAPI api, double value, double balanceOfNow) {

		if (balanceOfNow > value) {

			return value / api.getTicker(coin, base);

		} else {
			return 0;
		}
	}

	// 특정 갯수 만큼 삼
	private double buyCertainNum(exAPI api, double value, double balanceOfNow) {
		if (balanceOfNow / api.getTicker(coin, base) > value) {
			return value;
		} else {
			return 0;
		}
	}

	private double sellAll(double nomOfNowCoin) {

		return nomOfNowCoin;
	}

	private double sellCertainPrice(exAPI api, double value, double numOfNowCoin) {

		if (value / api.getTicker(coin, base) <= numOfNowCoin) {
			return value / api.getTicker(coin, base);
		} else {
			return 0;
		}
	}

	private double sellCertainNum(exAPI api, double value, double numOfNowCoin) {

		if (numOfNowCoin >= value) {
			return value;
		} else {
			return 0;
		}
	}

	private double getFinDeter(calcIndicator[] indicatorCalcer, String[] expList, int[] weightList) throws Exception {

		// 백테스트와 동일
		double ret = 0;
		for (int i = 0; i < indicatorCalcer.length; i++) {

			double temp = indicatorCalcer[i].getDeterminConstant() * weightList[i];
			System.out.println(indicatorCalcer[i].toString().split("@")[0] + " : " + temp);
			ret += temp * weightList[i];
		}

		return ret;
	}

	public void printStack(Stack<String> stk) {
		System.out.println("------");
		for (int i = 0; i < stk.size(); i++) {
			System.out.println(stk.get(stk.size() - i - 1));
		}
		System.out.println("------");
	}
}
