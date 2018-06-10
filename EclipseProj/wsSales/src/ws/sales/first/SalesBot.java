package ws.sales.first;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.Date;

import java.io.BufferedWriter;
import java.io.FileWriter;

public class SalesBot {
	
	static boolean STATUS = false;

	public static void main(String[] args) throws InterruptedException {
		// TODO Auto-generated method stub

        String fileNameD = "/usr/local/server/resDate.txt" ;
		while(SalesBot.STATUS) {
	        try{
	    		Date dt = new Date();
	    		System.out.println(dt.toString());
	    		
	            BufferedWriter fwD = new BufferedWriter(new FileWriter(fileNameD, true));
	             
	            fwD.write(dt.toString()+"\n");
	            fwD.flush(); 
	            fwD.close();	             	             
	        }
	        catch(Exception e){
	            e.printStackTrace();
	        }
			Thread.sleep(5000);
		}
	}

}
