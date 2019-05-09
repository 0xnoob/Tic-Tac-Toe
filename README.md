# Tic-Tac-Toe
*Created with CodeSandbox*

This repository contains the tic-tac-toe game from the official 
[React Tutorial: Intro to React](https://reactjs.org/tutorial/tutorial.html) with hooks & reducers.  
It's inspired by the YouTube video [Trying React Hooks for the first time with Dan Abramov](https://www.youtube.com/watch?v=G-aO5hzo1aw), 
at the end of which ([1:01:36](https://www.youtube.com/watch?v=G-aO5hzo1aw&t=3694)) he mentiones a few things you can implement:

Seperate game logic and time traverling into two parts:
  * move game logic into a reducer
  * custom hook, that only deals with navigating between history states and using reducer to manage that state
  
That's what this repository did!

There are four *versions* of the game, each in one of the index.*.js files: 
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
  1. `index.js`
     * :heavy_check_mark: hooks instead of class components.
     * :heavy_check_mark: Reducer
     * :heavy_check_mark: Time Travel
--->
     
&nbsp;| `index`<br/>`.no-reducer`<br/>`.no-timetravel.js` | `index`<br/>`.no-timetravel.js` | `index`<br/>`.no-reducer.js` |`index.js` 
------------ | ------------- | ------------- | ------------- | -------------
Based on | [cdpn.io/LyyXgK][LyyXgK] |  [cdpn.io/LyyXgK][LyyXgK] | [cdpn.io/gWWZgR][gWWZgR] | [cdpn.io/gWWZgR][gWWZgR]
[React Hooks](https://reactjs.org/hooks) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
[Reducer](https://reactjs.org/docs/hooks-reference.html#usereducer) | :heavy_multiplication_x: | :heavy_check_mark: | :heavy_multiplication_x: | :heavy_check_mark:
[Time Travel](https://reactjs.org/tutorial/tutorial.html#adding-time-travel) | :heavy_multiplication_x: | :heavy_multiplication_x:| :heavy_check_mark: | :heavy_check_mark:
    

  [LyyXgK]: https://codepen.io/gaearon/pen/LyyXgK?editors=0010
  [gWWZgR]: https://codepen.io/gaearon/pen/gWWZgR?editors=0010
