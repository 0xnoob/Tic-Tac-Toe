import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const Message = (
  <>
    <h1>Tic-Tac-Toe with hooks & reducers</h1>
    <h2>In CodeSandbox</h2>
    <p>
      Select an <code>index.*.js</code> file in the directory tree to your left
      and toggle the <em>Project View</em> button in the upper right corner to
      play that variant.
    </p>
    <h2>Otherwise</h2>
    <p>
      You need to remove or rename this placeholder <em>index.js</em> file and
      rename one of the <em>index.*.js</em> files to <em>index.js</em> in order
      to play that variant.
    </p>
  </>
);
ReactDOM.render(Message, document.getElementById("root"));
