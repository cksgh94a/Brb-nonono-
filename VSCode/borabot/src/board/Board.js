import React, { Component } from 'react';
import axios from 'axios';
import Post from './Post';

class Board extends Component {
  constructor(){
    super();
    this.state={
      post: false,
      post_num: 0,
      boardList: [1,23,4,5,6,8,9,5,6,8,9,5,6,8,9,5,6,8,9,5,6,8,9,5,6,8,9],
      write: false,
      pageNum:1,
      pageNumList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
  }

  componentDidMount() {
    this.getBoard()
  }

  getBoard = () => {
    axios.get( 'Board' )
    .then( response => {
      this.setState({
        boardList: response.data
      })
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  selectPage = (i) => {
    this.setState({
      pageNum: i
    })
    this.setState({
      pageNumList: [parseInt((i-1)/10)*10+1, parseInt((i-1)/10)*10+2, parseInt((i-1)/10)*10+3, parseInt((i-1)/10)*10+4, parseInt((i-1)/10)*10+5,
        parseInt((i-1)/10)*10+6, parseInt((i-1)/10)*10+7, parseInt((i-1)/10)*10+8, parseInt((i-1)/10)*10+9, parseInt((i-1)/10)*10+10]
    })
    console.log(this.state.pageNum)
    console.log(this.state.pageNumList)
  }

  selectPost = (i) => {
    this.setState({
      post: true,
      post_num: this.state.boardList[i].post_num, // map으로 돌릴 때 인자로 post num을
      write: false
    })
  }

  moveList = () => {
    this.setState({
      post: false,
      write: false,
      post_num: 0
    })
    this.getBoard()
  }

  writePost = () => {
    this.setState({
      post: true,
      write: true,
      post_num: 0
    })
  }

  handleChange = (e) => {
    this.setState({
      test: e.target.value
    })
  }

  render() {
    return (
      <div>
        {this.state.post
          ? <div><Post post_num={this.state.post_num} write={this.state.write}/>
          <button onClick={this.moveList}>목록으로</button></div>
          : <table>
            <thead><tr>
              <th colSpan="4" className="text-right">List</th>
            </tr><tr>
              <th>No</th><th>Title</th><th>Author</th><th>Date</th>
            </tr></thead>
            <tbody>
              {
                this.state.boardList.map((p, i) => {
                return (<tr key={i}>
                  <td>{p.post_num}</td>
                  <td onClick={() => this.selectPost(i)} style={{cursor:"pointer"}}>{p.title}{p.comment_count !== '0' &&' ('+p.comment_count+')'}</td>
                  <td>{p.email}</td>
                  <td>{p.post_time}</td>
                </tr>)
              })}
              <tr>
                <td colSpan="4">
                  <a onClick={() => this.selectPage(1)}>&lt;&lt; </a>
                  {this.state.pageNum>10 && <a onClick={() => this.selectPage(this.state.pageNum-10)}> &lt;</a>}                  
                  {this.state.pageNumList.map((p, i) => {
                    return(<a key ={i} onClick={() => this.selectPage(p)}>
                      {this.state.pageNum === p
                      ? <b>  {p}  </b>
                      : <span>  {p}  </span>}
                      </a>
                    )
                  })}
                  {parseInt((this.state.pageNum-1)/10) < parseInt((this.state.boardList.length-1)/10) &&
                   <a onClick={() => this.selectPage(this.state.pageNum+10)}>&gt; </a>}     
                  <a onClick={() => this.selectPage(this.state.boardList.length)}> &gt;&gt;</a>
                </td>
              </tr>
              <button onClick={this.writePost}>글 쓰기</button>
            </tbody>
          </table>}
      </div>
    );
  }
}

export default Board;

