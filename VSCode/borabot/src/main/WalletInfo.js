import React,{Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import './WalletInfo.css';

class WalletInfo extends Component{
	constructor(props) {
		super(props);

		this.state = {
				selectedWallet: []
		};
	}

	handleExchange = (e) => {
		axios.get( 'Wallet?exchange='+e.target.value )
		.then( response => {
		this.setState({ selectedWallet : response.data})
		})
		.catch( response => { console.log('err\n'+response); } ); // ERROR
		this.forceUpdate(); // 새로고침
	}

	render() {
		const { exchangeList } = this.props

		return(
			<div className = "walletInfo-container">
				<div style = {{marginTop : "20px", textAlign : "center", fontSize : "18px", fontWeight : "bold" }}>
					내 지갑
				</div>

				<div style = {{marginTop : "20px" }}>
					<select className = "wallet-select" id="WI_exchangeSelectbox" size = '1' onChange = {this.handleExchange}
						placeholder={'Select something'}>
						<option selected hidden disabled>거래소</option>
						{exchangeList.map((exchange, i) => {
								return (<option key = {i}>{exchange.key}</option>)
						})}
					</select>
				</div>

				{this.state.selectedWallet.map((w, i) => {
					return (
						<div style={{marginLeft : '20px', marginTop : '20px' , fontSize : '14px', fontWeight : 'bold'}}>{w.coin} : {w.balance}</div>
					)
				})}
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