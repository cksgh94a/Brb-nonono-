package tass;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import exchangeAPI.HitbtcAPI;

public class initializing {

	public static void printArray(double[] arr) {

		for (int i = 0; i < arr.length; i++) {
			System.out.print(arr[i] + " ");
		}
		System.out.println();
	}

	public static long dateToUt(LocalDateTime ldt) {

		ZoneId zoneId = ZoneId.systemDefault(); // or: ZoneId.of("Europe/Oslo");
		long epoch = ldt.atZone(zoneId).toEpochSecond();

		return epoch;
	}

	public static Date utToDate(long Utime) {

		Date date = new Date();
		date.setTime((long) Utime * 1000);

		return date;
	}
}