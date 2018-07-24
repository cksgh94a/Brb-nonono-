import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Content extends Component {
  constructor(){
    super();
    this.state={
      view: false,    // true: 글 보기/수정, false: 글 작성
      modify: false,  // true: 글 수정, false: 글 보기
      post_num: 0,
      post: '',
      comment:[],
      email:''
    }
  }

  componentDidMount() {  
    axios.get('Status')
    .then( response => {
      this.setState({
        email: response.data.email,
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR

    if(this.props.match.params.status === 'write'){
      this.setState({
        view: false
      })
    }
    else{
      this.setState({
        view: true,
        post_num: this.props.match.params.status
      })
      // 해당 게시물 내용 불러오기
      axios.get( 'board' )
      .then( response => {
      }) 
      .catch( response => { console.log('err\n'+response)}); // ERROR
    }
  }

  enrollPost = () => {  
    axios.post( 
      'Post', 
      'profile='+false+
      '&exchange_name='+document.getElementById('exchange_name').value+
      '&api_key='+document.getElementById('api_key').value+
      '&secret_key='+document.getElementById('secret_key').value,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    )
  }

  deletePost = () => {

  }

  enrollComment = () => {
    alert('댓글')
  }

  deleteComment = () => {

  }

  render() {
    return (
      <div>
        title: <input readOnly={this.state.view}>{this.state.post.title}</input><br/>
        <textarea readOnly={this.state.view}>{this.state.post.content}</textarea><br/>
        {!this.state.view && <div><button onClick={this.enrollPost}>저장</button><button onClick={this.enrollPost}>삭제</button></div>}
        <input placeholder="댓글을 입력하세요" disabled={!this.state.view}></input ><button onClick={this.enrollComment} disabled={!this.state.view}>댓글 등록</button>
        {
          this.state.comment.map((c, i) => {
          return (<div>댓글 작성자 : {c.email}<input readOnly>{c.content}</input>
          {c.email === this.state.email && <button onClick={this.deleteComment}>댓글 삭제</button>}
          </div>)
        })}
      </div>
    );
  }
}

export default Content;

