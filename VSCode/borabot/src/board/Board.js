import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Post from './Post';

var boardList=[];

class Board extends Component {
  constructor(){
    super();
    this.state={
      post: true,
      post_num: 0,
      write: false
    }
  }

  componentDidMount() {
    axios.get( 'board' )
    .then( response => {
      boardList= response.data
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  selectPost = () => {
    this.setState({
      post: true,
      post_num: 0, // map으로 돌릴 때 인자로 post num을
      write: false
    })
  }

  moveList = () => {
    this.setState({
      post: false,
      write: false
    })
  }

  writePost = () => {
    this.setState({
      post: true,
      write: true
    })
  }

  render() {
    return (
      <div>
        {this.state.post
          ? <div><Post post_num={this.state.post_num} write={this.state.write}/>
          <button onClick={this.moveList}>목록으로</button></div>
          : <table>
            <thead>
              <tr>
                <th colSpan="5" className="text-right">List</th>
              </tr>
              <tr>
                <th>No</th><th>Title</th><th>Author</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td onClick={this.selectPost}>title</td>
                <td>author</td>
                <td>date</td>
                <td><button>글 삭제</button></td>
              </tr>
              <button onClick={this.writePost}>글 쓰기</button>
            </tbody>
          </table>}
      </div>
    );
  }
}

export default Board;

