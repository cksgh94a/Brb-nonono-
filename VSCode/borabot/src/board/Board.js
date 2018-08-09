import React, { Component } from 'react';
import axios from 'axios';
import Post from './Post';

import './Board.css';

class Board extends Component {
  constructor(){
    super();
    this.state={
      post: false,  // true : 게시물 작성, 보기, false : 목록 표시
      write: false, // true : 게시물 작성, false : 게시물 보기 / 목록 표시

      post_num: 0,  // 현재 선택된 게시물 번호
      postList: [], // 현재 선택된 페이지의 10개의 게시물 리스트

      pageNum:1,  // 현재 선택된 페이지 번호
      pageNumList: [] // 게시물의 전체 페이지 리스트
    }
  }

  componentWillMount() {
    this.getBoard(1)
  }

  // 처음 게시판을 보거나 페이지가 바뀌었을 때 호출하여 10개의 게시물을 불러오고 페이지리스트 갱신
  getBoard = (i) => {
    axios.get( 'Board?pageNum='+i )
    .then( response => {
      var pNL = [1]  // state에 저장할 페이지리스트 생성
      for(var i = 2; i <= (response.data.count-1)/10+1; i++){
        pNL.push(i)
      }
      this.setState({
        postList: response.data.postList, // 10개의 게시물 저장
        pageNumList: pNL
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  // 페이지를 선택하면 state 변화후 게시물을 새로 불러옴
  selectPage = (i) => {
    var pn = 1  // 서버에 호출할 페이지 번호
    if(i > this.state.pageNumList.length){
      pn = this.state.pageNumList.length
      this.setState({
        pageNum: this.state.pageNumList.length
      })
    } else {
      pn = i
      this.setState({
        pageNum: i
      })
    }

    this.getBoard(pn)
  }

  // 게시물을 선택하면 해당 게시물 표시
  selectPost = (i) => {
    this.setState({
      post: true,
      post_num: this.state.postList[i].post_num,
      write: false
    })
  }

  // 게시물에서 목록으로 돌아가는 버튼
  moveList = () => {
    this.setState({
      post: false,
      write: false,
      post_num: 0
    })
    this.getBoard(this.state.pageNum)
  }

  // 게시물 작성
  writePost = () => {
    this.setState({
      post: true,
      write: true,
      post_num: 0
    })
  }

  render() {
    const { post, post_num, write, postList, pageNum, pageNumList} = this.state
    return (
      <div class="board_total">
        <div class="board">
          { // 게시물 작성/보기일 경우엔 게시물 표시, 아니면 목록 표시
          post
          ? <div>
              <div class="board_title">전략 공유 게시판</div>
              <Post post_num={post_num} write={write}/>  
              {/*목록버튼*/}
              <button id="listButton" onClick={this.moveList}><img src={require('../img/common/btn_13.png')} /></button>
            </div>

          : <table>
              <thead>
                <tr>
                  <th colSpan="4" className="text-right">전략 공유 게시판</th>
                </tr>
                <div class="table_title">
                  <tr>
                    <div class="table_title_1">
                      <th>No</th>
                    </div>
                    <div class="table_title_2">
                      <th>제목</th>
                    </div>
                    <div class="table_title_3">
                      <th>작성자</th>
                    </div>
                    <div class="table_title_4">
                      <th>날짜</th>
                    </div>
                  </tr>
                </div>
              </thead>
              <tbody>
                <div class="board_contents">
                  { // state에 저장된 게시물 리스트를 map 함수 통하여 표시
                  postList.map((p, i) => {
                    return (<tr key={i}>
                      <td>{p.post_num}</td>
                      <td onClick={() => this.selectPost(i)} style={{cursor:"pointer"}}>{p.title}{p.comment_count !== '0' &&' ('+p.comment_count+')'}</td>
                      <td>{p.email}</td>
                      <td>{p.post_time}</td>
                    </tr>)
                  })}
                </div>
              </tbody>
              {/*저장버튼*/}
              <button id="boardButton" onClick={this.writePost}><img src={require('../img/common/btn_11.png')} alt="btn_11" /></button>

              <div class="board_page">
                { /* 이전 10 페이지 이동 버튼*/ }
                  <a onClick={() => this.selectPage(parseInt((pageNum-11)/10,10)*10+10)}><img src={require('../img/common/pre_btn_01.png')}/></a>
                  { // 현재 선택된 페이지의 근처 10개 페이지 표시
                  pageNumList.slice(parseInt((pageNum-1)/10,10)*10, parseInt((pageNum-1)/10,10)*10+10).map((p, i) => {
                    return(<a key ={i} onClick={() => this.selectPage(p)}>
                      {pageNum === p ? <b>  {p}  </b> : <span>  {p}  </span>}
                    </a>)
                  })}                
                { /* 이후 10 페이지 이동 버튼*/ }
                  <a onClick={() => this.selectPage(parseInt((pageNum+9)/10,10)*10+1)}><img src={require('../img/common/next_btn_01.png')} /></a>
              </div>
            </table>}
        </div>
      </div>
    );
  }
}

export default Board;

