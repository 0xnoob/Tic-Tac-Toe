/* III.A [final step with useReducer and Time Travel]
 * React Tutorial: "Intro to React"
 * - with hooks instead of class components.
 * - with reducer
 * - with Time Travel
 * based on:
 * https://codepen.io/gaearon/pen/gWWZgR?editors=0010
 */
import React, { useReducer } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

// =============== Reducers ===============

function gameLogicReducer(state, index) {
  const newSquares = state.squares.slice();
  const xIsNext = state.xIsNext;
  newSquares.splice(index, 1, xIsNext ? "X" : "O");
  return {
    squares: newSquares,
    xIsNext: !xIsNext
  };
}

function timeTravelReducer(state, action) {
  switch (action.type) {
    case "HISTORY_ADD":
      const gameLogicAction = action.payload;
      let { gameLogicReducer, history, stepNumber } = state;
      let gameState = history[stepNumber];
      gameState = gameLogicReducer(gameState, gameLogicAction);
      stepNumber = stepNumber + 1;
      history = history.slice(0, stepNumber);
      history = history.concat([gameState]);
      return {
        gameLogicReducer,
        history,
        stepNumber
      };
    case "HISTORY_JUMPTO":
      return {
        ...state,
        stepNumber: action.payload
      };
    default:
      return state;
  }
}

// ============= Custom Hook ==============

function useTimeTravel(gameLogicReducer, initialState) {
  const [timeTravel, dispatchTimeTravel] = useReducer(timeTravelReducer, {
    history: [initialState],
    gameLogicReducer,
    stepNumber: 0
  });
  const { history, stepNumber } = timeTravel;
  return [{ history, stepNumber }, dispatchTimeTravel];
}

// =========== React Components ===========

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board({ squares, onClick }) {
  function renderSquare(i) {
    return <Square value={squares[i]} onClick={() => onClick(i)} />;
  }
  return (
    <div>
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
  const initialBoardState = {
    squares: new Array(9).fill(null),
    xIsNext: true
  };
  const [{ history, stepNumber }, dispatchTimeTravel] = useTimeTravel(
    gameLogicReducer,
    initialBoardState
  );
  const current = history[stepNumber];

  function handleClick(i) {
    const squares = current.squares;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    dispatchTimeTravel({ type: "HISTORY_ADD", payload: i });
  }

  function jumpTo(step) {
    dispatchTimeTravel({ type: "HISTORY_JUMPTO", payload: step });
  }

  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (current.xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={i => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
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
