import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const Message = (
  <p>
    You need to remove this placeholder <mark>index.js</mark> file and rename
    one of the <mark>index.*.js</mark> files to <mark>index.js</mark> in order
    to play that version of <em>tic-tac-toe.</em>
  </p>
);
ReactDOM.render(Message, document.getElementById("root"));
