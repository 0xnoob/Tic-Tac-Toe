/* III [final step with useReducer and Time Travel]
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

function gameLogicReducer(state, action) {
  switch (action.type) {
    case "PLAY_MOVE":
      const index = action.payload;
      const newSquares = state.squares.slice();
      const xIsNext = state.xIsNext;
      newSquares.splice(index, 1, xIsNext ? "X" : "O");
      return {
        squares: newSquares,
        xIsNext: !xIsNext
      };
    case "PLAY_RESET":
      return {
        squares: new Array(9).fill(null),
        xIsNext: true
      };
    default:
      return state;
  }
}

function timeTravelReducer(state, action) {
  const { dispatchGame, actionReset } = state;
  let { actionHistory, stepNumber } = state;
  switch (action.type) {
    case "HISTORY_ADD":
      const gameAction = action.payload;
      stepNumber = stepNumber + 1;
      if (actionHistory.length === stepNumber) {
        return {
          ...state,
          dispatchGame,
          actionHistory: [...actionHistory, gameAction],
          stepNumber
        };
      } else {
        dispatchGame(actionReset);
        actionHistory = actionHistory.slice(0, stepNumber);
        actionHistory = actionHistory.concat([gameAction]);
        actionHistory.forEach(action => dispatchGame(action));
        return {
          ...state,
          dispatchGame,
          actionHistory,
          stepNumber: stepNumber
        };
      }
    case "HISTORY_JUMPTO":
      if (actionHistory.length === 0) return state;
      stepNumber = action.payload;
      dispatchGame(actionReset);
      for (let index = 0; index < stepNumber; index++) {
        dispatchGame(actionHistory[index]);
      }
      stepNumber = stepNumber - 1;
      return {
        ...state,
        stepNumber
      };
    default:
      return state;
  }
}

// ============= Custom Hook ==============

function useTimeTravel(dispatchGame, actionReset) {
  const [timeTravel, dispatch] = useReducer(timeTravelReducer, {
    dispatchGame,
    actionReset,
    actionHistory: [],
    stepNumber: -1
  });
  const { actionHistory } = timeTravel;
  return [actionHistory.length, dispatch];
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
  const [gameState, dispatchGame] = useReducer(
    gameLogicReducer,
    initialBoardState
  );
  const actionReset = { type: "PLAY_RESET" };
  const [stepNumber, dispatchTimeTravel] = useTimeTravel(
    dispatchGame,
    actionReset
  );
  // const current = history[stepNumber];

  function handleClick(i) {
    const squares = gameState.squares;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const gameAction = { type: "PLAY_MOVE", payload: i };
    dispatchGame(gameAction);
    dispatchTimeTravel({ type: "HISTORY_ADD", payload: gameAction });
  }

  function jumpTo(step) {
    dispatchTimeTravel({ type: "HISTORY_JUMPTO", payload: step });
  }

  const winner = calculateWinner(gameState.squares);

  const moves = Array.from({ length: stepNumber + 1 }, (step, move) => {
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
    status = "Next player: " + (gameState.xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={gameState.squares} onClick={i => handleClick(i)} />
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
