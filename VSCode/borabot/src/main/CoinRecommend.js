import React, { Component } from 'react';
import axios from 'axios';
import Slider from 'react-slick';

import './CoinRecommend.css';

class CoinRecommend extends Component {
  constructor(props) {
    super(props);

    this.state = {
      volumeHigh: {},
      priceHigh: {},
      biggestGap: {},
      exchangeList: []
    };
  }

  // 페이지 표시할 때 코인 추천 목록 받아옴
  componentDidMount() {
    axios.get('CoinRecommend')
    .then( response => {
      this.setState({
        volumeHigh: response.data.volumeHigh,
        priceHigh: response.data.priceHigh,
        biggestGap: response.data.biggestGap,
        exchangeList: response.data.exchangeList
      })
    })
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  render() {
    const { volumeHigh, priceHigh, biggestGap, exchangeList } = this.state

    const settings = {
      autoplay: true,
      autoplaySpeed:2000,
      vertical: true,
      arrows: false,
    };
    return (
      <Slider {...settings} >
        {exchangeList.map((e,i) => {
          return (
            <div style={{height:"100%"}}>
              {e} :: vH:{volumeHigh[e]} :: pH:{priceHigh[e]} :: bG:{biggestGap[e]}
            </div>
          )
        })}
      </Slider>
    );
  }

}

export default CoinRecommend;