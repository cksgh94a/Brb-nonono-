import React, { Component } from 'react';
import axios from 'axios';

import './NowTrading.css';
import TradingElement from './TradingElement';

class NowTrading extends Component {
    constructor(props) {
       super(props);

        this.state = {
            listE: []
        };
    }
    componentDidMount() {
        
        axios.get('NowTrading')
        .then( response => {
        this.setState({
            listE: response.data
            })
        }) 
        .catch( response => { console.log('err\n'+response); } ); // ERROR
    }

    reload = () => {
        this.forceUpdate(); // 새로고침
    }

    render() {
        return(
            <div >
                <button onClick={this.reload}>새로고침</button>
                <div className = "NowTrading-elementList">
                    {this.state.listE.map((nt, i) => {
                        return (<TradingElement name = {nt.bot_name} endDate = {nt.end_date} 
                            coin = {nt.coin} exchange = {nt.exchange_name}
                            profit = {nt.profit} strategy = {nt.strategy_name} key = {i}
                                    />);
                    })}
                </div>
            </div>
        );
    }

}

export default NowTrading;