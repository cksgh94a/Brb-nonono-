import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { selectTrading } from '../reducers/sales';

class Log extends Component {
  constructor(){
    super();
    this.state={    
      
      selectedTrade: {},
      selectedSalesAction: {},
      tradeList: [],
      logList: [], // 현재 선택된 페이지의 10개의 로그 리스트

      // 앞단 테스트용 ==================================================================================================================== //
      // tradeList: [{"exchange_name":"bithumb","bot_name":"asdfasdf","coin":"btckrw"},{"exchange_name":"bithumb","bot_name":"qweteaw","coin":"btckrw"},{"exchange_name":"bithumb","bot_name":"tqtqtqtq","coin":"btckrw"},{"exchange_name":"bithumb","bot_name":"xcbaqwesadg","coin":"btckrw"},{"exchange_name":"bithumb","bot_name":"zxbwefa","coin":"btckrw"},{"exchange_name":"bithumb","bot_name":"zxbwefaxzc","coin":"btckrw"},{"exchange_name":"bithumb","bot_name":"ㅋㅌ츚ㅂㄷㅅㅁㄴㅇㄹ","coin":"btckrw"}],
      // logList: [{"now_coin_number":"0.0","coin_intent":"0.0","now_balance":"0.0","trans_time":"2018-07-30 17:42:14","coin_price":"9175000.0","sales_action":"1"},{"now_coin_number":"0.0","coin_intent":"0.0","now_balance":"0.0","trans_time":"2018-07-30 17:47:12","coin_price":"9153000.0","sales_action":"1"}],
      // ================================================================================================================================ //

      pageNum:1,  // 현재 선택된 페이지 번호
      pageNumList: [] // 게시물의 전체 페이지 리스트
    }
  }

  componentDidMount() {
    axios.get( 'Log' )
    .then( response => {
      this.setState({
        tradeList: response.data,
        pageNumList: [1]
      })

      // 거래 현황에서 거래 기록을 눌렀을 경우
      this.props.selected &&
        response.data.map((t, i) => {
          if(t.bot_name === this.props.selectedTrading){
            this.setState({
              selectedTrade: t
            })
            this.getLog(t.bot_name, 1, '매수/매도')
            document.getElementById('botName').selectedIndex=i+1
          }
        })
    }) 
    .catch( response => { 
      console.log('err\n'+response); 
    }); // ERROR
  }

  handleChange = (e) => {
    if(e.target.id === 'botName' && document.getElementById('botName').selectedIndex !== 0){
      this.setState({ selectedTrade: this.state.tradeList[document.getElementById('botName').selectedIndex-1] })
      this.getLog(
        this.state.tradeList[document.getElementById('botName').selectedIndex-1].bot_name,
        1,
        '매수/매도'
      )
    } else {
      document.getElementById('botName').selectedIndex !== 0
      && this.getLog(
          this.state.tradeList[document.getElementById('botName').selectedIndex-1].bot_name,
          1,
          document.getElementById('salesAction').value
        )
    }
  }

  getLog = (bn, pN, sa) => {
    axios.post('Log', 
      'bot_name='+bn+
      '&pageNum='+pN+
      '&sales_action='+sa,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
    .then( response => {
      var pNL = [1]  // state에 저장할 페이지리스트 생성
      for(var i = 2; i <= (response.data.count-1)/10+1; i++){
        pNL.push(i)
      }
      this.setState({
        logList: response.data.logList,
        pageNumList: pNL
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  // 페이지를 선택하면 state 변화후 게시물을 새로 불러옴
  selectPage = (i) => {
    console.log(i, this.state.pageNumList)
    let pn = 1  // 서버에 호출할 페이지 번호
    if(i > this.state.pageNumList.length){
      pn = this.state.pageNumList.length
      this.setState({ pageNum: this.state.pageNumList.length })
    } else {
      pn = i
      this.setState({ pageNum: i })
    }
    console.log(i, this.state.pageNumList.length, pn)
    this.getLog(
      this.state.selectedTrade.bot_name,
      pn,
      document.getElementById('salesAction').value
    )
  }

  render() {
    const { tradeList, selectedTrade, logList, pageNum, pageNumList } = this.state
    return (
      <div>
        <h4>봇 선택</h4>
        <select id="botName" onChange={this.handleChange}>
          <option>봇 이름</option>
          {tradeList.map((t, i) => {
            return (<option key={i}> {t.bot_name} </option>)
          })}
        </select><br/>
        <select id="salesAction" onChange={this.handleChange}>
          <option>매수/매도</option><option>매수</option><option>매도</option>
        </select><br/>
        <h4>봇 기록</h4>        
        거래소 : {selectedTrade.exchange_name} | 코인 : {selectedTrade.coin}
          <table >
          <thead><tr>
            <th>거래 신호 시간</th><th>매매 행동</th><th>개당 코인 가격</th><th>코인 매매 수량</th><th>현재 보유 현금</th><th>현재 보유 코인수</th>
          </tr></thead>
          <tbody>
            { // state에 저장된 게시물 리스트를 map 함수 통하여 표시
            logList.map((l, i) => {
              return (<tr key={i}>
                <td>{l.trans_time}</td>
                <td>{l.sales_action === "1" ? ("매수") : ( "매도" )}</td>
                <td>{l.coin_price}</td>
                <td>{l.coin_intent}</td>
                <td>{l.now_balance}</td>
                <td>{l.now_coin_number}</td>
              </tr>)
            })}
            <tr>
              <td colSpan="6">
                { /* 첫 페이지, 이전 10 페이지 이동 버튼*/ }
                <a onClick={() => this.selectPage(1)}>&lt;&lt; </a>
                {pageNum>10 && <a onClick={() => this.selectPage(parseInt((pageNum-11)/10,10)*10+10)}> &lt;</a>}
                { // 현재 선택된 페이지의 근처 10개 페이지 표시
                pageNumList.slice(parseInt((pageNum-1)/10,10)*10, parseInt((pageNum-1)/10,10)*10+10).map((p, i) => {
                  return(<a key ={i} onClick={() => this.selectPage(p)}>
                    {pageNum === p ? <b>  {p}  </b> : <span>  {p}  </span>}
                  </a>)
                })}
                { /* 이후 10 페이지, 마지막 페이지 이동 버튼*/ }
                {parseInt((pageNum-1)/10, 10) < parseInt((pageNumList.length-1)/10, 10) &&
                  <a onClick={() => this.selectPage(parseInt((pageNum+9)/10,10)*10+1)}>&gt;
                </a>}     
                <a onClick={() => this.selectPage(pageNumList.length)}> &gt;&gt;</a>
              </td>
            </tr>
            <tr>
              <td colSpan="6"><button onClick={this.writePost}>글 쓰기</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    onSelectTrading: (tf, value) => dispatch(selectTrading(tf, value))
  }
}

let mapStateToProps = (state) => {
  return {
    selected: state.sales.selected,
    selectedTrading: state.sales.selectedTrading
  };
}

Log = connect(mapStateToProps, mapDispatchToProps)(Log);

export default Log;

