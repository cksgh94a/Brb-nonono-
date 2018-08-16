import React,{Component} from 'react';
import { connect } from 'react-redux';

import './WalletInfo.css';

class WalletInfo extends Component{
	render() {
		const { exchangeList } = this.props
		return(
			<div className = "walletInfo-container">
			<div style = {{marginTop : "20px", textAlign : "center", fontSize : "18px", fontWeight : "bold" }}>
						내 지갑
				</div>

				<div style = {{marginTop : "20px" }}>
					<select className = "wallet-select" id="WI_exchangeSelectbox" size = '1' onChange = {this.handleExchangeSelect} 
						placeholder={'Select something'}> 
						<option selected hidden disabled>거래소 선택</option>
						{exchangeList.map((exchange, i) => {
								return (<option key = {i}>{exchange.key}</option>)
						})}
					</select>

				</div>

				<div style={{marginLeft : '20px', marginTop : '20px' , fontSize : '14px', fontWeight : 'bold'}}>BTC : 3.201092929</div>
				<div style={{marginLeft : '20px', marginTop : '10px', fontSize : '14px', fontWeight : 'bold'}}>USDT : 780,029 </div>
			</div>

		);
	}
}

let mapStateToProps = (state) => {
  return {
    exchangeList: state.exchange.exchangeList,
  };
}

WalletInfo = connect(mapStateToProps)(WalletInfo);

export default WalletInfo;