import React, { Component } from 'react';
import axios from 'axios';

import './Post.css';

class Post extends Component {
  constructor(){
    super();
    this.state={
      modify: false,  // true: 게시물 수정, false: 게시물 보기&글 쓰기
      post: {},       // 게시물 내용
      comment:[]      // 댓글 목록
    }
  }

  componentWillMount() {
    // 글 작성일 경우
    if(this.props.write === 'write'){
      this.setState({
        modify: false
      })
    }
    else{ // 글 보기일 경우
      this.setState({
        modify: false,
      })

      // 해당 게시물 불러오기
      axios.get(
        'Post?post_num='+this.props.post_num,
        { 'Content-Type': 'application/x-www-form-urlencoded' } )
      .then( response => {
        (response.data === 'sessionExpired')
        // 세션 검증
        ? this.sessionExpired()
        : this.setState({
            post: response.data
          })
      })
      .catch( response => { console.log('err\n'+response)}); // ERROR
    }
  }

  // 세션 유효성 검증
  sessionExpired = () => {
    alert('세션이 종료되었습니다\n다시 로그인하세요')
    window.location = '/'
  }

  // 글 쓰기가 아닐 때 게시물 불러온 뒤에 댓글 불러오기
  componentDidMount() { this.props.write !== 'write' && this.getComment() }

  // 댓글 불러오는 함수
  getComment = () => {
    axios.get(
      'Comment?post_num='+this.props.post_num,
      { 'Content-Type': 'application/x-www-form-urlencoded' } )
    .then( response => {
      (response.data === 'sessionExpired')
      // 세션 검증
      ? this.sessionExpired()
      : this.setState({
          comment: response.data
        })
    })
    .catch( response => { console.log('err\n'+response)}); // ERROR
  }

  // 글 저장 버튼
  enrollPost = () => {
    // 제목 검증
    if(document.getElementById('title').value === '') {
      alert('제목을 입력하세요')
      return
    }
    // 내용 검증
    if(document.getElementById('content').value === '') {
      alert('내용을 입력하세요')
      return
    }

    // 저장 확인
    if(window.confirm("글을 저장하시겠습니까?")){
      var now = new Date();
      var post_time = now.getFullYear()+'-'+
        ("0"+(now.getMonth()+1)).slice(-2)+'-'+
        ("0"+now.getDate()).slice(-2)+'T'+
        ("0"+now.getHours()).slice(-2)+':'+
        ("0"+now.getMinutes()).slice(-2)+':'+
        ("0"+now.getSeconds()).slice(-2)+'.000'

      // 저장/수정에 따라 전송되는 정보를 다르게
      var params
      if(this.props.write){
        params = 'action=write'+
          '&title='+document.getElementById('title').value+
          '&content='+document.getElementById('content').value+
          '&post_time='+post_time
      } else if(this.state.modify){
        params = 'action=modify'+
          '&post_num='+this.props.post_num+
          '&title='+document.getElementById('title').value+
          '&content='+document.getElementById('content').value
      }

      // 서버에 전송
      axios.post(
        'Post', params,
        { 'Content-Type': 'application/x-www-form-urlencoded' })
      .then( response => {
        // 세션 검증
        (response.data === 'sessionExpired')
        ? this.sessionExpired()
        : alert('저장되었습니다.')
      })
      .catch( response => { console.log('err\n'+response)}); // ERROR

      window.location = "/board"; // 저장 완료 후 다시 게시판 목록으로
    }
  }

  // 글 수정 버튼
  modifyPost = () => {
    if(window.confirm("글을 수정하시겠습니까?")){
      this.setState({
        modify: true
      })
    }
  }

  // 글 수정 상태에서 제목 / 내용 변경 시 상태 변화
  handleModify = (e, h) => {
    if(h==='title'){
      this.setState({
        post:{
          title: e.target.value,
          content: this.state.post.content
        }
      })
    } else{
      this.setState({
        post:{
          title: this.state.post.title,
          content: e.target.value
        }
      })
    }

  }

  // 글 삭제 버튼
  deletePost = () => {
    if(window.confirm("글을 삭제하시겠습니까?")){
      axios.post(
        'Post',
        'action=delete'+
        '&post_num='+this.props.post_num,
        { 'Content-Type': 'application/x-www-form-urlencoded' })
      .then( response => {
        // 세션 검증
        (response.data === 'sessionExpired')
        ? this.sessionExpired()
        : alert('삭제되었습니다.')
      })
      .catch( response => { console.log('err\n'+response)}); // ERROR
      window.location = "/board"; // 삭제 완료 후 다시 게시판 목록으로
    }
  }

  // 댓글 등록 버튼
  enrollComment = () => {
    // 항목 검증
    if(document.getElementById('comment').value === '') {
      alert('댓글을 입력하세요')
      return
    }

    var now = new Date();
    var comment_time = now.getFullYear()+'-'+
      ("0"+(now.getMonth()+1)).slice(-2)+'-'+
      ("0"+now.getDate()).slice(-2)+'T'+
      ("0"+now.getHours()).slice(-2)+':'+
      ("0"+now.getMinutes()).slice(-2)+':'+
      ("0"+now.getSeconds()).slice(-2)+'.000'

    axios.post(
      'Comment',
      'action=enroll'+
      '&post_num='+this.props.post_num+
      '&comment='+document.getElementById('comment').value+
      '&comment_time='+comment_time,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
    .then( response => {
      // 세션 검증
      (response.data === 'sessionExpired')
      ? this.sessionExpired()
      : this.setState({
          comment: response.data
        })
    })
    .catch( response => { console.log('err\n'+response)}); // ERROR

    document.getElementById('comment').value = '' // 댓글 내용 초기화
  }

  // 댓글 삭제 버튼
  deleteComment = (i) => {
    if(this.state.comment.length>0){
      axios.post(
        'Comment',
        'action=delete'+
        '&post_num='+this.props.post_num+
        '&comment_time='+this.state.comment[i].comment_time,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )
      .then( response => {
        // 세션 검증
        (response.data === 'sessionExpired')
        ? this.sessionExpired()
        : this.setState({
            comment: response.data
          })
      })
      .catch( response => { console.log('err\n'+response)}); // ERROR
    }
  }

  render() {
    const { write } = this.props
    const { post, modify, comment} = this.state

    // 앞단 테스트용 - 글쓰기 클릭해서 포스트 확인 (state 변화시켜서 쓰기, 보기, 수정 가능)======================================================= //
    // const write = false
    // const modify = false
    // const post = {"writer":true,"title":"zxbasdfgweqtgw","email":"test","content":"asdgfweeqwrq","post_time":"2018-07-31 18:47:35"}
    // const comment = [{"comment_time":"2018-07-31 18:47:40","comment":"hhhhhhhhhhh","writer":false,"email":"test"}, {"comment_time":"2018-07-31 18:47:40","comment":"hhhhhhhhhhh","writer":false,"email":"test"},{"comment_time":"2018-07-31 18:47:40","comment":"hhhhhhhhhhh","writer":false,"email":"test"},{"comment_time":"2018-07-31 18:47:40","comment":"hhhhhhhhhhh","writer":false,"email":"test"},{"comment_time":"2018-07-31 18:47:40","comment":"hhhhhhhhhhh","writer":false,"email":"test"}]
    // ================================================================================================================================ //

    return (
      write || modify
      ? // 쓰기/수정이면
      <div class="post">
        <table class="post_table">
          <thead>
            <div class="post_table_title">
              <tr>
                <th class="post_table_title_1" style={{width:"160px"}}>제목</th>
                <td class="post_table_title_2">
                  {/* 제목 영역 */}
                  <input id="title" placeholder="제목을 입력해주세요" value={post.title} onChange={(e, h='title') => this.handleModify(e, h)}/>
                </td>
              </tr>
              <tr>
                <th class="post_table_title_1">내용</th>
                <td class="post_table_title_2">
                  {/* 내용 textarea 수정 가능 */}
                  <textarea id="content" placeholder="내용을 입력해주세요" value={post.content} onChange={(e, h='content') => this.handleModify(e, h)}/>
                  <br/>
                </td>
              </tr>
            </div>
          </thead>
        </table>
        <div class="post_btn">
          {/* 저장 버튼 */}
          <button id="saveButton" onClick={this.enrollPost}>
            <img src={require('../img/common/btn_12.png')} style={{cursor: "pointer"}}/>
          </button>
          {/* 목록 버튼*/}
          <button id="listButton1" onClick={this.props.toList}>
            <img src={require('../img/common/btn_13.png')} style={{cursor: "pointer"}}/>
          </button>
        </div>
      </div>

      : // 보기이면
      <div class="comment_total">
        <div class="comment_top">
          <table class="comment_top_table">
              {/* 제목 영역 */}
            <tr class="comment_top_title">
              <th class="comment_top_title_1">
                <h3>{post.title}</h3>
              </th>
              <th class="comment_top_title_2">
                <h5>{post.email} &nbsp; | &nbsp;&nbsp;{post.post_time}</h5>
              </th>
            </tr>
            <tr>
              {/* 내용 textarea */}
              <textarea id="content2" value={post.content} style={{height:334, width:1040, resize:"none"}} readOnly/>
              <br/>
            </tr>
        </table>
          <div class="post_buttons">
            {/* 글 작성자이면 수정/삭제 가능 */}
            <button id="post_edit" onClick={this.modifyPost} hidden={!post.writer}>
              <img src={require('../img/common/btn_14.png')} style={{cursor: "pointer"}}/>
            </button>
            <button id="post_delete" onClick={this.deletePost} hidden={!post.writer}>
              <img src={require('../img/common/btn_15.png')} style={{cursor: "pointer"}}/>
            </button>
            {/* 목록 버튼 */}
            <button id="listButton2" onClick={this.props.toList}>
              <img src={require('../img/common/btn_13.png')} style={{cursor: "pointer"}}/>
            </button>
          </div>
        </div>

        {/* 댓글 입력 영역 */}
        <div class="comment_bottom_1">
          <input id="comment" placeholder="댓글을 입력하세요" style={{height: 63, width: 910, resize:"none"}}/>
          <button id="comment_new" onClick={this.enrollComment}>
            <img src={require('../img/common/btn_16.png')} style={{cursor: "pointer"}}/>
          </button>
        </div>

        {/* 댓글 목록 영역 */}
        <div class="comment_commentTotal">
          { comment.map((c, i) => {
            return (
              <div class="comment_bottom_2" style={{border:"1px solid"}}>
                <div class="comment_title">
                  <b>{c.email}</b>  <small>{c.comment_time}</small>
                </div>
                <div class="comment_delete">
                  { // 댓글 작성자이면 삭제 버튼
                  c.writer
                  && <button id="comment_delete" onClick={() => this.deleteComment(i)}>
                      <img src={require('../img/common/btn_15.png')} style={{cursor: "pointer"}}/>
                    </button>}
                  <br/>
                </div>
                <div class="comment_comment">
                  {c.comment}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default Post;
