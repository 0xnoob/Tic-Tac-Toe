# Tic-Tac-Toe
*Play with it on [CodeSandbox](https://codesandbox.io/s/github/0xnoob/Tic-Tac-Toe)*

This repository contains the tic-tac-toe game from the official 
[React Tutorial: Intro to React](https://reactjs.org/tutorial/tutorial.html), but with hooks & reducers.  
It's inspired by the YouTube video [Trying React Hooks for the first time with Dan Abramov](https://www.youtube.com/watch?v=G-aO5hzo1aw), 
at the end of which ([1:01:36](https://www.youtube.com/watch?v=G-aO5hzo1aw&t=3694)) he mentiones a few things you can implement:

> Seperate the game logic and time traveling into two independent parts:
>   * move the game logic into a reducer
>  * create a custom hook that uses a reducer to manage the history state and takes care of time travel

That's what this repository is for.

---

There are four *implementation variants* of the game, each in one of the `src/index.*.js` files: 
<!---
  1. `index.no-reducer.no-timetravel.js` based on [codepen.io/gaearon/pen/LyyXgK](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)
     * :heavy_check_mark: [React Hooks](https://reactjs.org/hooks)
     * :heavy_multiplication_x: [Reducer](https://reactjs.org/docs/hooks-reference.html#usereducer)
     * :heavy_multiplication_x: [Time Travel](https://reactjs.org/tutorial/tutorial.html#adding-time-travel)
  1. `index.no-timetravel.js`
     * :heavy_check_mark:  React Hooks
     * :heavy_check_mark:  Reducer
     * :heavy_multiplication_x:  Time Travel
  1. `index.no-reducer.js` based on [codepen.io/gaearon/pen/gWWZgR](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)
     * :heavy_check_mark: React Hooks
     * :heavy_multiplication_x: Reducer
     * :heavy_check_mark: Time Travel
  1. `index.varA.js`
     * :heavy_check_mark: hooks instead of class components.
     * :heavy_check_mark: Reducer
     * :heavy_check_mark: Time Travel
  1. `index.varB.js`
     * :heavy_check_mark: hooks instead of class components.
     * :heavy_check_mark: Reducer
     * :heavy_check_mark: Time Travel
--->
     
&nbsp;| [`index`<br/>`.no-reducer`<br/>`.no-timetravel.js`][0] | [`index`<br/>`.no-timetravel.js`][1] | [`index`<br/>`.no-reducer.js`][2] | [`index`<br/>`.varA`<br/>`.js`][3] | [`index`<br/>`.varB`<br/>`.js`][4]
------------ | ------------- | ------------- | ------------- | ------------- | -------------
Based on | [cdpn.io/LyyXgK][LyyXgK] |  [cdpn.io/LyyXgK][LyyXgK] | [cdpn.io/gWWZgR][gWWZgR] | [cdpn.io/gWWZgR][gWWZgR] | [cdpn.io/gWWZgR][gWWZgR]
[React Hooks](https://reactjs.org/hooks) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
[Reducer](https://reactjs.org/docs/hooks-reference.html#usereducer) | :heavy_multiplication_x: | :heavy_check_mark: | :heavy_multiplication_x: | :heavy_check_mark: | :heavy_check_mark:
[Time Travel](https://reactjs.org/tutorial/tutorial.html#adding-time-travel) | :heavy_multiplication_x: | :heavy_multiplication_x:| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:

The first three are straightforward to write - the last two (`index.varA.js` and `index.varB.js`) are of interest, because they include a *custom Hook* that manages time travel (`useTimeTravel`).

## Difference between `index.varA.js` and `index.varB.js`
> **tl;dr**
> * `index.varA.js`'s custom Hook is a wrapper for your game logic: You handle game-state-transitions through it. That saves you from dispatching actions to your game-reducer as well as your timetravel-reducer, **but** you still have to deal with the `history` array (e.g. `const current = history[history.length - 1];`)
> * In `index.varB.js`'s you dispatch actions to your game-reducer and timetravel-reducer, **but** you don't have to deal with the `history` anymore.

### [`index.varA.js`][3]
This variant uses a custom Hook that is a wrapper around the reducer of the game logic.
```javascript
function Game() {
  [...]
  // custom Hook
  const [{ history, stepNumber }, dispatchTimeTravel] = useTimeTravel(
    gameLogicReducer, 
    initialBoardState
  );
  [...]
} 
```
To get the current state of the game and to change it (e.g. if someone clicks on a square), you always work with the custom Hook.
```javascript
function Game() {
  [...]
  const current = history[stepNumber]; // history and stepNumber are returned by your custom hook
  [...]
  function handleClick(i) {
    [...]
    // the payload is the action to the reducer of the game (which is in this case just the index)
    dispatchTimeTravel({ type: "HISTORY_ADD", payload: i });
  }

  function jumpTo(step) {
    dispatchTimeTravel({ type: "HISTORY_JUMPTO", payload: step });
  }
  [...]
}
```
The `gameLogicReducer` is only called inside the `timeTravelReducer()` to get the new state of the game.
```javascript
function timeTravelReducer(state, action) {
  switch (action.type) {
    case "HISTORY_ADD":
     const gameLogicAction = action.payload;
     let { gameLogicReducer, history, stepNumber } = state;
     let gameState = history[stepNumber];
     gameState = gameLogicReducer(gameState, gameLogicAction);
     [...]
  }
}
```
That's why the code in our `Game()` function component is very similar to the [final code of the tutorial][gWWZgR]: We are still working with the history object.
```javascript
function Game() {
  [...]
  const current = history[stepNumber]; // history and stepNumber are returned by your custom hook
  [...]
  const winner = calculateWinner(current.squares);
  [...]
  status = "Next player: " + (current.xIsNext ? "X" : "O");
  [...]
  <Board squares={current.squares} onClick={i => handleClick(i)} />
  [...]
}
```

---
### [`index.varB.js`][4]
This variant uses a custom Hook that is used additionally to the reducer of the game
```javascript
function Game() {
  [...]
  const [gameState, dispatchGame] = useReducer(
    gameLogicReducer,
    initialBoardState
  );
  const [stepNumber, dispatchTimeTravel] = useTimeTravel(dispatchGame,
    { type: "PLAY_RESET" } // an action to reset the game is required
  );
  [...]
}
```
Instead of calling the game reducer inside the time travel reducer, you call both directly in your `Game()` component.
```javascript
function Game() {
[...]
  function handleClick(i) {
    [...]
    const gameAction = { type: "PLAY_MOVE", payload: i };
    dispatchGame(gameAction); 
    dispatchTimeTravel({ type: "HISTORY_ADD", payload: gameAction });
  }
}
```
For this to work, the game reducer has to implement a second type of state change, to reset the game.
```javascript
function gameLogicReducer(state, action) {
  [...]
    case "PLAY_RESET":
      return {
        squares: new Array(9).fill(null),
        xIsNext: true
      };
    [...]
}
```
That's because the time travel reducer doesn't have full control over the game state: He can only dispatch action and unlike in `index.varA.js` can't just replace the state of the game.  
When you jump back in time, the time travel reducer has to reset the game and replay it until the chosen move is reached.
```javascript
function timeTravelReducer(state, action) {
    [...]
    case "HISTORY_JUMPTO":
      [...]
      dispatchGame(actionReset); // actionReset === { type: "PLAY_RESET }
      actionHistory = actionHistory.slice(0, stepNumber);
      actionHistory.forEach(action => dispatchGame(action));
      [...]
  }
}
```
The upside of this is, that you can just use the game state and don't have to mess with an `history` array in your `Game` component.
```javascript
function Game() {
  [...]
  const winner = calculateWinner(gameState.squares);
  [...]
  const winner = calculateWinner(gameState.squares);
  [...]
  const winner = calculateWinner(gameState.squares);
  [...]
}
```

[LyyXgK]: https://codepen.io/gaearon/pen/LyyXgK?editors=0010
[gWWZgR]: https://codepen.io/gaearon/pen/gWWZgR?editors=0010
[0]: src/index.no-reducer.no-timetravel.js
[1]: src/index.no-timetravel.js
[2]: src/index.no-reducer.js
[3]: src/index.varA.js
[4]: src/index.varB.js
