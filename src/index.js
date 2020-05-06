import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "resetize";
import "./global.css";

import Timer from "./components/Timer";

ReactDOM.render(
  <React.StrictMode>
    <Timer />
  </React.StrictMode>,
  document.getElementById("root")
);
