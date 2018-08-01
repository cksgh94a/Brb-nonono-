import React, { Component } from 'react';
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

  componentWillMount() {
    // 글 작성
    if(this.props.write === 'write'){ 
      this.setState({
        modify: false
      })
    }
    else{ // 글 보기     
      this.setState({
        modify: false,
      })

      // 해당 게시물과 댓글 불러오기
      axios.get(
        'Post?post_num='+this.props.post_num,
        { 'Content-Type': 'application/x-www-form-urlencoded' } )
      .then( response => {
        this.setState({
          post: response.data
        })
      }) 
      .catch( response => { console.log('err\n'+response)}); // ERROR
    }
  }

  componentDidMount() { if(this.props.write !== 'write') this.getComment() }

  getComment = () => {
    axios.get(
      'Comment?post_num='+this.props.post_num,
      { 'Content-Type': 'application/x-www-form-urlencoded' } )
    .then( response => {
      this.setState({
        comment: response.data
      })
    }) 
    .catch( response => { console.log('err\n'+response)}); // ERROR
  }

  enrollPost = () => { 
    // 항목 검증
    if(document.getElementById('title').value === '') {
      alert('제목을 입력하세요')
      return
    }
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

      axios.post( 
        'Post', params,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )
      alert('저장되었습니다.')
      
      window.location = "/board"; // 저장 완료 후 다시 게시판 목록으로
    }
  }

  modifyPost = () => { 
    if(window.confirm("글을 수정하시겠습니까?")){
      this.setState({
        modify: true
      })
    }
  }

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

  deletePost = () => {
    if(window.confirm("글을 삭제하시겠습니까?")){
      axios.post( 
        'Post', 
        'action=delete'+
        '&post_num='+this.props.post_num,
        { 'Content-Type': 'application/x-www-form-urlencoded' }
      )
      alert('삭제되었습니다.')
      window.location = "/board"; // 삭제 완료 후 다시 게시판 목록으로
    }
  }

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
      this.setState({
        comment: response.data
      })
    }) 
    .catch( response => { console.log('err\n'+response)}); // ERROR

    document.getElementById('comment').value = ''
  }

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
        this.setState({
          comment: response.data
        })
      }) 
      .catch( response => { console.log('err\n'+response)}); // ERROR
    }
  }

  render() {
    const { write } = this.props
    const { post, modify, comment} = this.state
    return (
      <div>
        {write || modify
        ? <div><input id="title" value={post.title} onChange={(e, h='title') => this.handleModify(e, h)}/></div>
        : <div><h3>{post.title}</h3>
          {post.email} | {post.post_time}</div>
        }
        <textarea id="content" value={post.content} onChange={(e, h='content') => this.handleModify(e, h)} style={{height:500, width:"70%", resize:"none"}} readOnly={!write && !modify}/><br/>
        {(write || modify) && <button onClick={this.enrollPost}>저장</button>}
        {(!write && !modify) && <div>
          {post.writer && <div><button onClick={this.modifyPost}>수정</button><button onClick={this.deletePost}>삭제</button></div>}
          <input id="comment" placeholder="댓글을 입력하세요"></input >
          <button onClick={this.enrollComment}>댓글 등록</button>
          {
            comment.map((c, i) => {
            return (<div>{c.email} <input value={c.comment} readOnly></input> : {c.comment_time }
              {c.writer && <button onClick={() => this.deleteComment(i)}>댓글 삭제</button>}
              </div>)
          })}
        </div>}
      </div>
    );
  }
}

export default Post;

