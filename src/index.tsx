import React from "react";
import ReactDOM from "react-dom";

import App from "src/components/App";

import "resetize";
import "src/style/global.css";

ReactDOM.render(
  <React.StrictMode children={<App />} />,
  document.getElementById("root")
);
