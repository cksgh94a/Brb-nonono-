import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

var boardList=[];

class Board extends Component {

  componentDidMount() {
    axios.get( 'board' )
    .then( response => {
      boardList= response.data
    }) 
    .catch( response => { console.log('err\n'+response); } ); // ERROR
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th colSpan="5" className="text-right">
            <Link to="/board/write"  className="btn btn-primary">
                글 쓰기
            </Link>
            </th>
          </tr>
          <tr>
            <th>No</th><th>Title</th><th>Author</th><th>Date</th><th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
              <td>1</td>
              <td><Link to={'/board/' + "id"}>title</Link></td>
              <td>author</td>
              <td>date</td>
              <td><button>글 삭제</button></td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default Board;

