import java.sql.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedList;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.util.Queue;
import bittrexAPI.*;
import cern.colt.matrix.DoubleMatrix1D;
import cern.colt.matrix.impl.DenseDoubleMatrix1D;
import java.lang.Object;
import org.apache.commons.math3.stat.correlation.PearsonsCorrelation;
import java.io.*;

class tradingBot {

	Gson gson = new Gson();

	String botName;
	String _ID;
	String start;
	String end;
	String exchange;
	String coin_exchange;
	String coin_crypto;
	private String Algoset;
	private String API_KEY;
	private String Sec_KEY;
	private double priceAmount; // 처음 시작 하는 돈
	private double coinmany = 0;

	// Algoset에서 뽑아내야함
	int _period_day = 20;
	int _mul = 2;
	int _interval = 60;
	int _corrInterval = 60; // 패턴인식하는데 1분봉을 사용, 즉 1분마다 서치
	int _totalLength = 1440; // 하루치 데이터의 패턴을 비교
	int _intervalNumber = 15; // 15분의 패턴을 본다는 뜻

	// test 초기값
	int testNum = 0; // 비트코인 0개
	double testStartAsset = 1000000000; // 10억

	// DB
	private Connection conn = null;
	private Statement stmt = null;
	private ResultSet rs = null; // ResultSet 객체 선언
	private String url = "jdbc:mysql://127.0.0.1/practice_db?user=root&password=01028798551&serverTimezone=UTC";
	// private String url =
	// "jdbc:mysql://127.0.0.1/test_ljh?user=root&serverTimezone=UTC";
	
	//File
	FileWriter writer;
	BufferedWriter bufWriter;
	
	public tradingBot(double priceAmount, String _ID, String start, String end, String exchange, String coin_crypto,
			String coin_exchange, String Algoset, String API_KEY, String Sec_KEY, String botName) {
		this.priceAmount = priceAmount;
		this.testStartAsset = priceAmount;
		this._ID = _ID;
		this.start = start;
		this.end = end;
		this.exchange = exchange;
		this.coin_crypto = coin_crypto;
		this.coin_exchange = coin_exchange;
		this.Algoset = Algoset;
		this.API_KEY = API_KEY;
		this.Sec_KEY = Sec_KEY;
		this.botName = botName;
		this.priceAmount = priceAmount;
		try {
			writer = new FileWriter("C:\\Users\\Lee Jun-hyeong\\Desktop\\patternlog.txt");
			bufWriter = new BufferedWriter(writer);
		} catch (Exception e) {
			System.out.println(e.toString());
		}
		try {

			Class.forName("com.mysql.cj.jdbc.Driver");
			System.out.println("드라이버 로드 성공!");
			conn = DriverManager.getConnection(url);
			System.out.println("데이터베이스 접속 성공!");
			stmt = conn.createStatement();
			String selectSql = "SELECT * FROM transaction_log;";

			rs = stmt.executeQuery(selectSql); // rs에 executeQuery의 실행결과를 삽입

			while (rs.next()) // next()에 대한 설명은 본문에
			{
				System.out.println(rs.getString(1) + "\t" + // 본문 설명
						rs.getString(2) + "\t" + rs.getString(3) + "\t" + rs.getString(4) + "\t" + rs.getString(5));
			}

		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException se) {
			se.printStackTrace();
		} finally {
			// if(conn!=null) try {conn.close();} catch (SQLException e) {}
		}
	}

	public double corrPatternAnalysis(Cryptowatch crypt, int interval, int totalLength, int intervalNumber) {
		double[] currentData = getHistoryArray(crypt, interval, intervalNumber, intervalNumber);
		double[] dayData = getHistoryArray(crypt, interval, totalLength, totalLength);

		System.out.print("현재부터 15분 전까지 데이터 : ".toString());
		for (int k = 0; k < intervalNumber; k++) {
			System.out.print(currentData[k] + " ");
		}
		
		
//		try {
//			bufWriter = new BufferedWriter(writer);
//			bufWriter.write("현재부터 15분 전까지 데이터 : ".toString());
//			for (int k = 0; k < intervalNumber; k++) {
//				bufWriter.write(currentData[k] + " ");	
//			}
//			bufWriter.newLine();bufWriter.flush();
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
		

		double currentSum = 0;
		for (double i : currentData) {
			currentSum += i;
		}
		double currentMean = currentSum / intervalNumber;
		for (int i = 0; i < intervalNumber; i++) {
			currentData[i] -= currentMean;
		}

		int idx = 0;
		double max = 0;
		for (int i = 0; i < totalLength - 40; i++) {

			double sum = 0;
			double[] temp = new double[intervalNumber];

			for (int j = 0; j < intervalNumber; j++) {
				temp[j] = dayData[i + j];
				sum += dayData[i + j];
			}

			for (int j = 0; j < intervalNumber; j++) {
				temp[j] -= sum / intervalNumber;
			}

			DoubleMatrix1D a = new DenseDoubleMatrix1D(currentData);
			DoubleMatrix1D b = new DenseDoubleMatrix1D(temp);
			double cosineDistance = a.zDotProduct(b) / Math.sqrt(a.zDotProduct(a) * b.zDotProduct(b));
			if (max < cosineDistance) {
				max = cosineDistance;
				idx = i;
			}
			// System.out.println("max :" + max + " idx :" + idx);
		}

		// System.out.println("max :" + max + " idx :" + idx);

		System.out.print("\n가장 일치하는 데이터 : ");
		for (int k = idx; k < idx + intervalNumber; k++) {
			System.out.print(dayData[k] + " ");
		}
		
		/*
		try {
			bufWriter = new BufferedWriter(writer);
			bufWriter.write("가장 일치하는 데이터 : ");
			for (int k = idx; k < idx + intervalNumber; k++) {
				bufWriter.write(dayData[k] + " ");
			}
			bufWriter.newLine();
			bufWriter.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		*/

		// 추세측정 idx+intervalNumber ~ 15개
		idx += 15;
		double[] x = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 };
		double[] y = new double[intervalNumber];
		for (int j = 0; j < intervalNumber; j++) {
			y[j] = dayData[idx++];
		}
		double corr = new PearsonsCorrelation().correlation(y, x);

		
		System.out.print("\n추후 데이터 : ");
		for (int k = 0; k < intervalNumber; k++) {
			System.out.print(y[k] + " ");
		}
		System.out.println();
		
		/*
		try {
			bufWriter = new BufferedWriter(writer);
			bufWriter.write("추후 데이터 : ");
			for (int k = 0; k < intervalNumber; k++) {
				bufWriter.write(y[k] + " ");
			}
			bufWriter.newLine();
			bufWriter.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		*/
		
		return corr;
	}

	public void patterNakedTrade() {

		System.out.println("pattrn진행!");
		Bittrex brx = new Bittrex(API_KEY, Sec_KEY, 30, 1); // 이부분은 차차 개선 -> 여러가지 거래소도 동일하게 추상화 필요
		Cryptowatch crypt = new Cryptowatch(10, 1); // 1회성 콜 -> 이대로 사용해도 괜찮음, 거래를 하지 않기 때문에 괜춘

//		try {
//        // 파일 객체 생성
//        File file = new File("/usr/local/server/apache-tomcat-8.0.52/webapps/"+this.botName+".txt");
//        BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(file));
        
		while (SalesBot.map.get(botName)) {
			double[] currentData = getHistoryArray(crypt, _corrInterval, _intervalNumber, _intervalNumber);
			double corr = corrPatternAnalysis(crypt, _corrInterval, _totalLength, _intervalNumber);
			System.out.println();
			if (corr > 0.5) {
				buyCoin(brx, 10, currentData[_intervalNumber - 1]); // buy
			} else if (corr < -0.5) {
				sellCoin(brx, 10, currentData[_intervalNumber - 1]); // sell
			} else {
				doNothing();
			}        
//			
//            if(file.isFile() && file.canWrite()){
//                Date d = new Date();            
//                String time = d.toString();
//                bufferedWriter.write(this.botName + " " + time + SalesBot.map + "\n" + new Date());	// 쓰기
//                bufferedWriter.newLine();	// 개행문자쓰기  
//            }
	        

			try {
				Thread.sleep(6000*10+50);
			} catch (Exception e) {
				System.out.println(e.toString());
			}
			System.out.println();
		}
//		bufferedWriter.close();	// 로그는 임시로 마지막에 한번에 생성하게 해놈
//        
//        } catch(Exception e) {        	
//        }
	}

	public void trendFollowing(int less_ave, int more_ave) {

		Bittrex brx = new Bittrex(API_KEY, Sec_KEY, 30, 1); // 이부분은 차차 개선 -> 여러가지 거래소도 동일하게 추상화 필요
		Cryptowatch crypt = new Cryptowatch(10, 1); // 1회성 콜 -> 이대로 사용해도 괜찮음, 거래를 하지 않기 때문에 괜춘

		Queue<Double> more_que = new LinkedList<Double>();
		Queue<Double> less_que = new LinkedList<Double>();

		more_que = getHistoryQueue(crypt, 14400, more_ave);
		less_que = getHistoryQueue(crypt, 14400, less_ave);

		Iterator<Double> iter = null;
		iter = more_que.iterator();
		double more_sum = 0;
		while (iter.hasNext()) {
			more_sum += iter.next();
		}
		double more_average = more_sum / more_ave;

		iter = less_que.iterator();
		double less_sum = 0;
		while (iter.hasNext()) {
			more_sum += iter.next();
		}
		double less_average = more_sum / more_ave;

		double currentLast = getCurrentPrice(crypt, coin_crypto);
		System.out.println(" -->  현재가 : " + currentLast);

		if (less_average > more_average) {
			buyCoin(brx, 10, currentLast); // buy
		} else {
			sellCoin(brx, 10, currentLast); // sell
		}

	}

	public void bollingerPatternNaked() {
		Bittrex brx = new Bittrex(API_KEY, Sec_KEY, 30, 1); // 이부분은 차차 개선 -> 여러가지 거래소도 동일하게 추상화 필요
		Cryptowatch crypt = new Cryptowatch(10, 1); // 1회성 콜 -> 이대로 사용해도 괜찮음, 거래를 하지 않기 때문에 괜춘

		// 인터벌 몇분, 인터벌 갯수 정해서 큐에 넣어줌 (볼린저)
		Queue<Double> history_queue = getHistoryQueue(crypt, _interval, _period_day * _interval);

		// while
		// getBollinder -> queue를주고 다음 상하한을 받음
		// wait 5.0001초
		// 값을 받고 비교 -> 로직
		// B S W 리턴 -> 실행		
		// queue 새로세팅
		

//        try {
//            // 파일 객체 생성
//            File file = new File("/usr/local/server/apache-tomcat-8.0.52/webapps/"+this.botName+".txt");
//            BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(file));

    		while (SalesBot.map.get(botName)) {

//    			try {
//    				bufWriter = new BufferedWriter(new FileWriter("C:\\Users\\Lee Jun-hyeong\\Desktop\\patternlog.txt"));
//    			} catch (IOException e1) {
//    				// TODO Auto-generated catch block
//    				e1.printStackTrace();
//    			}
    			
    			double[] bollingerHL = getBollinger(crypt, history_queue, _mul);
    			// ------------------
    			try {
    				Thread.sleep(1000 * _interval);
    			} catch (Exception e) {
    				System.out.println(e.toString());
    			}
    			// -------------------
    			double currentLast = getCurrentPrice(crypt, coin_crypto);
    			System.out.println(" --> 현재가 : " + currentLast);
    			// -----------------
    			// 매수타이밍
    			if (currentLast < bollingerHL[1]) {
    				// BUY
    				// 얼마나 살건지 알고리즘 셋팅에 따라
    				System.out.println("잠정적 매수 타이밍");
    				double corr = corrPatternAnalysis(crypt, _corrInterval, _totalLength, _intervalNumber);
    				if (corr > 0.4) {
    					System.out.print("Perason Correlation Coefficieint : " + corr+ " ");
    					buyCoin(brx, 50, currentLast);
    				} else if (corr < -0.5) {
    					System.out.print("Perason Correlation Coefficieint : " + corr+ " ");
    					sellCoin(brx, 40, currentLast);
    				
    				} else {
    					doNothing();
    				}
    			}
    			// 매도타이밍
    			else if (currentLast > bollingerHL[0]) {
    				// SELL
    				// 얼마나 팔건지 알고리즘 셋팅에 따라
    				System.out.println("잠정적 매도 타이밍");
    				double corr = corrPatternAnalysis(crypt, _corrInterval, _totalLength, _intervalNumber);
    				if (corr > 0.3) {
    					System.out.print("Perason Correlation Coefficieint : " + corr+ " ");
    					buyCoin(brx, 20, currentLast);
    				} else if (corr < -0.5) {
    					System.out.print("Perason Correlation Coefficieint : " + corr+ " ");
    					sellCoin(brx, 80, currentLast);
    				} else {
    					doNothing();
    				}
    			}
    			// 대기타이밍
    			else {
    				// wait
    				System.out.println("잠정적 대기 타이밍");
    				double corr = corrPatternAnalysis(crypt, _corrInterval, _totalLength, _intervalNumber);
    				if (corr > 0.75) {
    					//4개구매
    					System.out.print("Perason Correlation Coefficieint : " + corr+ " ");
    					buyCoin(brx, 30, currentLast);
    				} else {
    					System.out.print("Perason Correlation Coefficieint : " + corr+ " ");
    					doNothing();
    				}
    			}
    			// -----------------
    			history_queue.remove();
    			history_queue.add(currentLast);
    			System.out.println("돈으로 환산한 총 현재 재산 : " + (int)(currentLast * testNum + testStartAsset) + "KRW");
    			System.out.println();
//                if(file.isFile() && file.canWrite()){
//                    bufferedWriter.write(this.botName + " 보유자산 : " + (int)(currentLast * testNum + testStartAsset) + "KRW\n" + new Date());	// 쓰기
//                    bufferedWriter.newLine();	// 개행문자쓰기  
//                }
    		}
//    		bufferedWriter.close();	// 로그는 임시로 마지막에 한번에 생성하게 해놈
            
//        } catch(Exception e) {        	
//        }

	}

	public void Bollingertrade() {

		Bittrex brx = new Bittrex(API_KEY, Sec_KEY, 30, 1); // 이부분은 차차 개선 -> 여러가지 거래소도 동일하게 추상화 필요
		Cryptowatch crypt = new Cryptowatch(10, 1); // 1회성 콜 -> 이대로 사용해도 괜찮음, 거래를 하지 않기 때문에 괜춘

		// 인터벌 몇분, 인터벌 갯수 정해서 큐에 넣어줌
		Queue<Double> history_queue = getHistoryQueue(crypt, _interval, _period_day * _interval);

		// while
		// getBollinder -> queue를주고 다음 상하한을 받음
		// wait 5.0001초
		// 값을 받고 비교 -> 로직
		// B S W 리턴 -> 실행
		// queue 새로세팅
		while (SalesBot.map.get(botName)) {

			double[] bollingerHL = getBollinger(crypt, history_queue, _mul);
			// ------------------
			try {
				Thread.sleep(1000 * _interval);
			} catch (Exception e) {
				System.out.println(e.toString());
			}
			// -------------------
			double currentLast = getCurrentPrice(crypt, coin_crypto);
			System.out.println("현재가 : " + currentLast);
			// -----------------
			// 매수타이밍
			if (currentLast < bollingerHL[1]) {
				// BUY
				// 얼마나 살건지 알고리즘 셋팅에 따라

				buyCoin(brx, 10, currentLast);
			} else if (currentLast > bollingerHL[0]) {
				// SELL
				// 얼마나 팔건지 알고리즘 셋팅에 따라
				sellCoin(brx, 10, currentLast);
			} else {
				// wait
				doNothing();
			}
			// -----------------
			history_queue.remove();
			history_queue.add(currentLast);
        	
			System.out.println();
		}
	}

	// IOC 구현하기
	public boolean IOC_commit(Bittrex brx) {

		return true;
	}

	public void buyCoin(Bittrex brx, double amount, double price) {

		System.out.println("--> BUY");
		// brx.buyMarket(coin, Double.toString(amount));
		IOC_commit(brx);
		if (testStartAsset > price * amount) {
			testNum += amount;
			testStartAsset -= price * amount;
			System.out.print("구매한 코인의 수 : "+amount+", 구매한 코인의 개당 가격 : " + price + " --> ");
		}
		else if (testStartAsset < price * 1.5) {
			System.out.println("have no money to buy(or less than price of 1 coin)");
		}
		else {
			int how = (int)((int)testStartAsset / price);
			testNum += how;
			testStartAsset -= price * how;
			System.out.print("구매한 코인의 수 : "+how+", 구매한 코인의 개당 가격 : " + price + " --> ");
		}
		
		Cryptowatch crypt = new Cryptowatch(10, 1);
		double currentLast = getCurrentPrice(crypt, coin_crypto);

    	for(int i = SalesBot.nowTrading.size() - 1; i >= 0; i--) {
    		
    		if((SalesBot.nowTrading.get(i).getId()+SalesBot.nowTrading.get(i).getName()).equals(botName)) {
    			SalesBot.nowTrading.get(i).setProfit(String.format("%.2f", ((currentLast * (double)testNum + testStartAsset)/priceAmount*100.0)));
    			double asd = ((currentLast * (double)testNum + testStartAsset)/priceAmount*100.0);
    			System.out.println();
    			System.out.println(String.format("%.2f", asd));
    			System.out.println();
    		}
		} 
    	
		// 디비 쿼리 날려주기
		// transaction log로 날려    	
		System.out.println("현재 코인 보유 수 : " + testNum + " / 현재 돈 : " + testStartAsset + "KRW");
		ExecSQL_Insert(_ID, exchange, coin_crypto, 1, amount, price);
	}

	public void sellCoin(Bittrex brx, double amount, double price) {

		System.out.println("--> SELL");
		// brx.sellMarket(coin, Double.toString(amount));
		if (testNum > amount) {
			testNum -= amount;
			testStartAsset += amount * price;
			System.out.print("판매한 코인의 수 : "+amount+", 판매한 코인의 개당 가격 : " + price + " --> ");
		} 
		else if (testNum == 0){
			System.out.println("have no coin to sell");
		}
		else{
			int temp = testNum;
			testStartAsset += testNum * price;
			testNum -= testNum;
			System.out.print("판매한 코인의 수 : "+temp+", 판매한 코인의 개당 가격 : " + price + " --> ");
		}
		
		Cryptowatch crypt = new Cryptowatch(10, 1);
		double currentLast = getCurrentPrice(crypt, coin_crypto);

    	for(int i = SalesBot.nowTrading.size() - 1; i >= 0; i--) {
    		
    		if((SalesBot.nowTrading.get(i).getId()+SalesBot.nowTrading.get(i).getName()).equals(botName)) {
    			SalesBot.nowTrading.get(i).setProfit(String.format("%.2f", ((currentLast * (double)testNum + testStartAsset)/priceAmount*100.0)));
    			double asd = ((currentLast * (double)testNum + testStartAsset)/priceAmount*100.0);
    			System.out.println(String.format("%.2f", asd));
    		}
		} 
		// 디비 쿼리 날려주기
		// transaction log로 날려줌
		System.out.println("현재 코인 보유 수 : " + testNum + " / 현재 돈 : " + testStartAsset + "KRW");
		ExecSQL_Insert(_ID, exchange, coin_crypto, 2, amount, price);
		
	}

	public void doNothing() {
		System.out.println("--> WAIT");

		System.out.println("현재 코인 보유 수 : " + testNum + " / 현재 돈 : " + testStartAsset + "KRW");
		// 디비 쿼리 날려주기
		ExecSQL_Insert(_ID, exchange, coin_crypto, 3, 0, 0);
		
		Cryptowatch crypt = new Cryptowatch(10, 1);
		double currentLast = getCurrentPrice(crypt, coin_crypto);

    	for(int i = SalesBot.nowTrading.size() - 1; i >= 0; i--) {
    		
    		if((SalesBot.nowTrading.get(i).getId()+SalesBot.nowTrading.get(i).getName()).equals(botName)) {
    			SalesBot.nowTrading.get(i).setProfit(String.format("%.2f", ((currentLast * (double)testNum + testStartAsset)/priceAmount*100.0)));
    			double asd = ((currentLast * (double)testNum + testStartAsset)/priceAmount*100.0);
    			System.out.println();
    			System.out.println(String.format("%.2f", asd));
    			System.out.println();
    		}
		} 
	}

	// 가격 히스토리를 보여줌 -> ohlc 중 뭘 사용할건지 추가 / interval과 갯수 파라미터
	public Queue getHistoryQueue(Cryptowatch crypt, int interval, int period_day) {

		Date date = new Date();
		long U_current = date.getTime() / 1000;
		// System.out.println(U_current);
		// System.out.println(date);

		String ohlc_string = crypt.getOHLC(exchange, coin_crypto, U_current - (_period_day * _interval), _interval);
		JsonObject ohlc_json = new JsonParser().parse(ohlc_string).getAsJsonObject();
		String ohlc_result_string = gson.toJson(ohlc_json.get("result"));
		JsonObject ohlc_result_json = new JsonParser().parse(ohlc_result_string).getAsJsonObject();
		JsonArray ohlc_jsarr = ohlc_result_json.get(Integer.toString(_interval)).getAsJsonArray();

		Queue<Double> history_queue = new LinkedList<Double>();

		JsonArray jsarr;
		System.out.println(ohlc_jsarr.size());
		for (int i = 0; i < ohlc_jsarr.size(); i++) {

			jsarr = ohlc_jsarr.get(i).getAsJsonArray();
			history_queue.add(jsarr.get(4).getAsDouble()); // 종가(C)만 사용
		}

		return history_queue;
	}

	public double[] getHistoryArray(Cryptowatch crypt, int interval, int period_day, int size) {

		Date date = new Date();
		long U_current = date.getTime() / 1000;

		String ohlc_string = crypt.getOHLC(exchange, coin_crypto, U_current - (period_day * interval), interval);
		JsonObject ohlc_json = new JsonParser().parse(ohlc_string).getAsJsonObject();
		String ohlc_result_string = gson.toJson(ohlc_json.get("result"));
		JsonObject ohlc_result_json = new JsonParser().parse(ohlc_result_string).getAsJsonObject();
		JsonArray ohlc_jsarr = ohlc_result_json.get(Integer.toString(_interval)).getAsJsonArray();
		// System.out.println("제이슨 크기 " + ohlc_jsarr.size());
		double[] historyArray = new double[ohlc_jsarr.size()];

		JsonArray jsarr;

		int bojung = ohlc_jsarr.size() - size;
		for (int i = 0; i < size; i++) {
			jsarr = ohlc_jsarr.get(i + bojung).getAsJsonArray();
			historyArray[i] = jsarr.get(4).getAsDouble();
		}

		// System.out.println("get historyarray done");
		return historyArray;
	}

	// 1회성 볼린저값 겟 , 이미 히스토리큐에 interval이 설정되어있음. 따라서 표준편차(mul)만 필요
	public double[] getBollinger(Cryptowatch crypt, Queue history_queue, int _mul) {

		Iterator<Double> iter = null;

		iter = history_queue.iterator();
		double sum = 0;
		while (iter.hasNext()) {
			sum += iter.next();
		}
		double average = sum / history_queue.size();

		iter = history_queue.iterator();
		double devsqr = 0;

		while (iter.hasNext()) {
			devsqr += (int) Math.pow(average - iter.next(), _mul);
		}

		double deviation = devsqr / (history_queue.size());
		double stddev = Math.sqrt(deviation);

		System.out.print("average : " + average);
		//System.out.print(" / 분산  : " + deviation);
		//System.out.print(" / 표준편차 : " + stddev);
		System.out.print(" / 다음 상한 : " + (average + stddev));
		System.out.print(" / 다음 하한 : " + (average - stddev));

		double ret[] = { average + stddev, average - stddev };
		return ret;
	}

	// 거래하는 거래소를 통하여 현재값을 받음. 현재값 중 종가를 사용 (Bid, Ask, Last)
	public double getCurrentPrice(Cryptowatch crypt, String coin_crypto) {

		String api_string = crypt.getCurrentPrice(exchange, coin_crypto); // api콜 -> string을 가지고옴
		JsonObject json_result = new JsonParser().parse(api_string).getAsJsonObject(); // string을 json으로 변경
		String result_string = gson.toJson(json_result.get("result")); // json 중에서 result를 string으로 파싱
		JsonObject result_json = new JsonParser().parse(result_string).getAsJsonObject(); // result를 다시 json으로 파싱
		double currentLast = Double.parseDouble(result_json.get("price").toString());

		return currentLast;
	}

	public void ExecSQL_Insert(String _ID, String exchange_name, String coin_name, int sale, double amount,
			double currentPrice) {

		// sale -> 1: BUY, 2: SELL, 3: WAIT
		String currentTime = LocalTime.now().toString();
		String val = "(\"" + botName + "\"," + "\"" + _ID + "\",\"" + currentTime + "\", " + sale + "," + "\""
				+ exchange_name + "\",\"" + coin_name + "\");";
		String selectSql = "INSERT INTO transaction_log VALUES" + val;

		try {
			stmt = conn.createStatement();
			stmt.executeUpdate(selectSql);
			//System.out.println("sql문 삽입 성공 : " + selectSql);
		}

		catch (Exception e) {
			System.out.println(e.toString());
		}
	}

}
