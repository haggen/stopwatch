import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "src/components/App";

import "src/style/global.css";

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
