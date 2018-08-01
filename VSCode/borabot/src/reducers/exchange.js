const BITHUMB = {
  name: 'BITHUMB',
  baseList: [ "KRW"],
  coin: [
    {
    base: "KRW",
    list: [ "BTC", "ETH", "DASH", "LTC", "ETC", "XRP", "BCH", "XMR", "ZEC", "BTG", "EOS" ]
    }
  ]
}

const COINONE = {
  name: 'COINONE',
  baseList: [ "KRW"],
  coin: [
    {
    base: "KRW",
    list: [ "BTC", "BCH", "ETH", "ETC", "LTC", "BTG" ]
    }
  ]
}

const BINANCE = {
  name: 'BINANCE',
  baseList: [ "BTC", "USDT"],
  coin: [
    {
      base: "BTC",
      list: [ "ETH", "TRX", "XRP", "NEO", "BCD", "BNB", "VIB", "WTC", "ELF", "ICX", "IOST","VEN", "EOS", "XLM", "XVG", "PPT", "ONT", "OMG" ]
    },
    {
      base: "USDT",
      list: [ "BCC", "BNB", "BTC", "ETH", "LTC", "NEO", "ADA", "EOS", "IOTA", "TUSD", "XLM", "XRP", "ICX", "ONT" ]
    }
  ]
}

const Exchange = {
	exchangeList: [ "BITHUMB", "COINONE", "BINANCE" ],
	exchange: [ BITHUMB, COINONE, BINANCE ],
  intervalList: {
    display: [ "5분", "30분", "1시간", "6시간", "12시간", "24시간"],
    value: ["300", "1800", "3600", "21600", "43200", "86400"]
  }
};

export const exchange = (state = Exchange, action) => {
	switch(action.type) {
		default:
			return state;
	}
};