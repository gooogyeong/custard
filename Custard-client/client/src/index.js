import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
//import { Provider } from "react-redux";
import { Provider } from "mobx-react";
import { RootStore } from "./stores";
import thunk from "redux-thunk";

import App from "./App";
import rootReducer from "./reducers/rootReducer";

//const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider rootStore={new RootStore()}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);

// ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
