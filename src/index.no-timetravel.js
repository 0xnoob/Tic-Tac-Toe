/* II.b [first step with useReducer]
 * React Tutorial: "Intro to React"
 * - with hooks instead of class components.
 * - with reducer
 * - without Time Travel
 * based on:
 * https://codepen.io/gaearon/pen/LyyXgK?editors=0010
 */
import React, { useReducer } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

// ================ Reducer ===============

function reducer(state, index) {
  let { squares, xIsNext } = state;
  squares = squares.slice();
  squares[index] = xIsNext ? "X" : "O";
  return {
    squares,
    xIsNext: !xIsNext
  };
}

// =========== React Components ===========

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  const [state, dispatch] = useReducer(reducer, {
    squares: new Array(9).fill(null),
    xIsNext: true
  });
  const { squares, xIsNext } = state;

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    dispatch(i);
  }

  function renderSquare(i) {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <div>{/* status */}</div>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  );
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
