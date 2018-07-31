const STORENT = 'STORENT';

export function storeNT(value) {
	return {
		type: STORENT,
		tradingList: value
	};
}

const TradingStatus = {
	tradingList: []
};

export const nowTrading = (state = TradingStatus, action) => {
	switch(action.type) {
		case STORENT:
			return Object.assign({}, state, {
				tradingList: action.tradingList
			});
		default:
			return state;
	}
};
