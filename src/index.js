import React from "react";
import ReactDOM from "react-dom";

import "resetize";
import "./style/global.css";

import App from "./components/App";

ReactDOM.render(
  <React.StrictMode children={<App />} />,
  document.getElementById("root")
);
