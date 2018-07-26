import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Post extends Component {
  constructor(){
    super();
    this.state={
      modify: false,
      post: {},
      comment:[]
    }
  }

  componentDidMount() {
    // 글 작성
    if(this.props.write === 'write'){ 
      this.setState({
        modify: false
      })
    }
    else{ // 글 보기     
      this.setState({
        modify: false,
        post_num: this.props.post_num
      })

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
          '&content='+document.getElementById('content').value+
          '&post_time='+post_time
      } else console.log('응??????')

      axios.post( 
        'Post', params,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )

      alert('저장되었습니다.')
    }
  }

  modifyPost = () => { 
    if(window.confirm("글을 수정하시겠습니까?")){
      this.setState({
        modify: true
      })
    }
  }

  deletePost = () => {
    if(window.confirm("글을 삭제하시겠습니까?")){
      axios.post( 
        'Post', 
        'action=delete'+
        '&post_num='+this.state.post_num,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )
      alert('삭제되었습니다.')
    }
  }

  enrollComment = () => {
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
      '&comment='+document.getElementById('comment').value+
      '&comment_time='+comment_time,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
  }

  deleteComment = (i) => {
    axios.post( 
      'Comment', 
      'action=delete'+
      '&post_num='+document.getElementById('comment').value+
      '&comment_time='+this.state.comment[i].comment_time,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
  }

  render() {
    return (
      <div>
        title: <input id="title" readOnly={!this.props.write && !this.state.modify}>{this.state.post.title}</input><br/>
        <textarea id="content" style={{height:500, width:"70%", resize:"none"}} readOnly={!this.props.write && !this.state.modify}>{this.state.post.content}</textarea><br/>
        {(this.props.write || this.state.modify) && <button onClick={this.enrollPost}>저장</button>}
        {this.state.post.writer && <button onClick={this.deletePost}>삭제</button>}
        {(!this.props.write && !this.state.modify) && <div>
          <button onClick={this.modifyPost}>수정</button><br/>
          <input id="comment" placeholder="댓글을 입력하세요"></input >
          <button onClick={this.enrollComment}>댓글 등록</button>
          {
            this.state.comment.map((c, i) => {
            return (<div>댓글 작성자 : {c.email}<input readOnly>{c.content}</input>
            {c.writer && <button onClick={(i) => this.deleteComment(i)}>댓글 삭제</button>}
            </div>)
          })}
        </div>}
      </div>
    );
  }
}

export default Post;

