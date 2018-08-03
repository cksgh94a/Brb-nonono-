import React, { Component } from 'react';
import TradingViewWidget, { Themes, BarStyles } from 'react-tradingview-widget';
import { connect } from 'react-redux';

import { setChart } from '../reducers/sales';
import './ChartSelect.css';

class ChartSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      exchangeIndex: 0,
      baseIndex: 0,
      coinIndex: 0,
      intervalIndex: 0
    };
  }

  handleIndex = () => {
    this.props.onSetChart({
      sales: false
    })
    this.setState({
      exchangeIndex: document.getElementById('exchange').selectedIndex,
      baseIndex: document.getElementById('base').selectedIndex,
      coinIndex: document.getElementById('coin').selectedIndex,
      intervalIndex: document.getElementById('interval').selectedIndex
    })
    console.log(document.getElementById('interval').selectedIndex)
    console.log(this.state)
  }

  render() {
    const { exchangeList, intervalList, sales } = this.props
    var { exchangeIndex, baseIndex, coinIndex, intervalIndex } = this.props.sales
    sales.sales
    ? { exchangeIndex, baseIndex, coinIndex, intervalIndex } = this.props.sales
    : { exchangeIndex, baseIndex, coinIndex, intervalIndex } = this.state

    console.log(sales.sales, exchangeIndex, baseIndex, coinIndex, intervalIndex)
    return (
      <div className="ChartSelect">
      거래소 : <select id="exchange" onChange={this.handleIndex}>
        {exchangeList.map((exchange, index) => {
          return (<option key={index} > {exchange.key} </option>)
        })
        }
      </select>
      기축통화 : <select id="base" onChange={this.handleIndex}>
        {exchangeList[exchangeIndex].value.baseList.map((base, i) => {
          return (<option key={i}> {base} </option>)
        })}
      </select>
      코인 : <select id="coin" onChange={this.handleIndex}>
        {exchangeList[exchangeIndex].value.coin[baseIndex].list.map((coin, i) => {
          return (<option key={i}> {coin} </option>)
        })}
      </select>
      거래 간격 : <select id="interval" onChange={this.handleIndex}>
        {intervalList.map((int, i) => {
          return (<option key={i}> {int.key} </option>)
        })}
      </select>
      <TradingViewWidget
        symbol={exchangeList[exchangeIndex].key+":"+exchangeList[exchangeIndex].value.coin[baseIndex].list[coinIndex]+exchangeList[exchangeIndex].value.baseList[baseIndex]}
        theme={Themes.DARK}
        locale="kr"
        interval={intervalList[intervalIndex].value/60}
        hide_top_toolbar
      />
      </div>
    );
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    onSetChart: (value) => dispatch(setChart(value))
  }
}

let mapStateToProps = (state) => {
  return {
    exchangeList: state.exchange.exchangeList,
    intervalList: state.exchange.intervalList,

    sales: state.sales
  };
}

ChartSelect = connect(mapStateToProps, mapDispatchToProps)(ChartSelect);


export default ChartSelect;