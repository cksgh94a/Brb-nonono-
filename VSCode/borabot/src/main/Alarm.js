import React, {Component} from 'react';
import axios from 'axios';

// import './Alarm.css'

class Alarm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alarmList: []
    };
  }

  componentDidMount() {    
    axios.get('Alarm')
    .then( response => {
      this.setState({
        alarmList: response.data
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
    // this.props.handleAlarm()
  }

  render() {
    return (
      <table>
        <thead>
          <th>거래소</th><th>코인</th><th>매매</th><th>수량</th><th>가격</th><th>시간</th>
        </thead>
        <tbody>
            { // state에 저장된 게시물 리스트를 map 함수 통하여 표시
            this.state.alarmList.map((l, i) => {
              return (<tr key={i}>
                <td>{l.exchange_name}</td>
                <td>{l.coin}</td>
                <td>{l.sales_action === "1" ? ("매수") : ( "매도" )}</td>
                <td>{l.coin_intent}</td>
                <td>{l.coin_price}</td>
                <td>{l.trans_time}</td>
              </tr>)
            })}
        </tbody>
      </table>
    );
	}
}

export default Alarm;