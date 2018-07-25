import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Content extends Component {
  constructor(){
    super();
    this.state={
      write: false,    // true: 글 작성, false: 글 보기/수정
      modify: false,  // true: 글 수정, false: 글 보기/작
      post_num: 0,
      post: '',
      comment:[],
      email:''
    }
  }

  componentDidMount() {  
    axios.get('/Status')
    .then( response => {
      this.setState({
        email: response.data.email,
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR

    // 글 작성
    if(this.props.match.params.write === 'write'){ 
      this.setState({
        write: true,
        modify: false
      })
    }
    else{
      // 글 수정
      if(this.props.match.params.modify === 'modify'){
        this.setState({
          write: false,
          modify: true,
          post_num: this.props.match.params.status
        })
      }
      // 글 보기
      else{
        this.setState({ 
          write: false,
          modify: false,
          post_num: this.props.match.params.status
        })
      }

      // 해당 게시물 내용 불러오기
      axios.get( '/board' )
      .then( response => {
      }) 
      .catch( response => { console.log('err\n'+response)}); // ERROR
    }
  }

  enrollPost = () => { 
    if(window.confirm("글을 저장하시겠습니까?")){
      var now = new Date();
      var post_time = now.getFullYear()+'-'+
        ("0"+(now.getMonth()+1)).slice(-2)+'-'+
        ("0"+now.getDate()).slice(-2)+'T'+
        ("0"+now.getHours()).slice(-2)+':'+
        ("0"+now.getMinutes()).slice(-2)+':'+
        ("0"+now.getSeconds()).slice(-2)+'.000'

      axios.post( 
        'Post', 
        'action=write'+
        '&title='+document.getElementById('title').value+
        '&content='+document.getElementById('content').value+
        '&post_time='+post_time,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )

      alert('저장되었습니다.')
    }
  }

  modifyPost = () => { 
    if(window.confirm("글을 수정하시겠습니까?")){
      axios.post( 
        '/Post', 
        'action=modify'+
        '&post_num='+this.state.post_num+
        '&title='+document.getElementById('title').value+
        '&content='+document.getElementById('content').value,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )

      alert('저장되었습니다.')
    }
  }

  deletePost = () => {
    if(window.confirm("글을 삭제하시겠습니까?")){
      axios.post( 
        '/Post', 
        'action=delete'+
        '&post_num='+this.state.post_num,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )
      alert('삭제되었습니다.')
    }
  }

  enrollComment = () => {
  }

  deleteComment = () => {

  }

  moveList = () => {
    window.location = "/board";
  }

  render() {
    return (
      <div>
        title: <input id="title" readOnly={!this.state.write && !this.state.modify}>{this.state.post.title}</input><br/>
        <textarea id="content" style={{height:500, width:"70%", resize:"none"}} readOnly={!this.state.write&!this.state.modify}>{this.state.post.content}</textarea><br/>
        {(this.state.write || this.state.modify) && <button onClick={this.enrollPost}>저장</button>}
        {this.state.modify && <button onClick={this.deletePost}>삭제</button>}
        {(!this.state.write && !this.state.modify) && <div>
          <button onClick={this.modifyPost}>수정</button><br/>
          <input id="comment" placeholder="댓글을 입력하세요" disabled={!this.state.view}></input >
          <button onClick={this.enrollComment} disabled={!this.state.view}>댓글 등록</button>
          {
            this.state.comment.map((c, i) => {
            return (<div>댓글 작성자 : {c.email}<input readOnly>{c.content}</input>
            {c.email === this.state.email && <button onClick={this.deleteComment}>댓글 삭제</button>}
            </div>)
          })}
        </div>}
      <Link to="/board"><button>목록으로</button></Link>
      </div>
    );
  }
}

export default Content;

