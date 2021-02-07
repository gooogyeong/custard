import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { Provider } from "mobx-react";
import { rootStore } from "./stores";

import App from "./App";

ReactDOM.render(
  <Provider rootStore={rootStore}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
