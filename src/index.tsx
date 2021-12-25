import { StrictMode } from "react";
import ReactDOM from "react-dom";

import "src/style/global.css";

import App from "src/components/App";

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
