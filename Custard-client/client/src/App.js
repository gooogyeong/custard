import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link, Switch, Redirect } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
//import { connect } from "react-redux";
import "./App.css";
import Mypage from "./components/Mypage";
import Login from "./components/Login";
import Study from "./components/Study";
import AllDeckList from "./components/AllDeckList";
import Deck from "./components/Deck";
import AddCard from "./components/AddCard";
import Signup from "./components/Signup";
import Score from "./components/Score";

//import { initUser, checkAuthPersistence } from "./actions/mypageActions";

import custard_logo_1 from "./custard_logo_1.png";
import custard_logo_2 from "./custard_logo_2.png";
import custard_logo_3 from "./custard_logo_3.png";
import custard_logo_no from "./custard_logo_no.png";
import custard_logo_noo from "./custard_logo_noo.png";

@inject((stores) => ({
  userStore: stores.rootStore.userStore,
}))
@observer
class App extends Component {
  state = { sideNav: false };
  //material-ui Drawer 사용해도 됨
  handleMouseEnter() {
    this.setState({
      sideNav: true,
    });
  }
  handleMouseLeave() {
    this.setState({
      sideNav: false,
    });
  }

  componentDidMount() {
    console.log("app checking auth persistence");
    this.props.userStore.checkAuthPersistence();
  }

  render() {
    const { uuid, isLogin } = this.props.userStore;
    return (
      <div>
        <div id="login-logo-container">
          <img
            className="login-logo"
            src={custard_logo_no}
            style={!isLogin ? { display: "none" } : {}}
          />
        </div>
        <div className="app">
          <div className="logout-logo-container">
            <img
              className="logout-logo"
              src={custard_logo_noo}
              style={isLogin ? { display: "none" } : {}}
            />
          </div>

          <div
            id="mySidenav"
            className="sideNav"
            onMouseEnter={this.handleMouseEnter.bind(this)}
            onMouseLeave={this.handleMouseLeave.bind(this)}
            style={this.state.sideNav ? { width: 250 } : { width: 30 }}
          >
            <Link to="/mypage">Mypage</Link>
            <Link to="/decks">Decks</Link>
          </div>
          <div className="app-content">
            <Switch>
              <Route
                exact
                path="/"
                render={() => {
                  if (uuid) {
                    return <Redirect to="/mypage" />;
                  } else {
                    return <Redirect to="/login" />;
                  }
                }}
              />
              <Route
                exact
                path="/login"
                component={Login}
                render={() => {
                  if (isLogin) {
                    return <Redirect to="/mypage" />;
                  } else {
                    return <Login />;
                  }
                }}
              />
              <Route
                exact
                path="/decks"
                component={AllDeckList}
                render={() => {
                  if (isLogin) {
                    return <AllDeckList />;
                  } else {
                    return <Redirect to="/login" />;
                  }
                }}
              />
              <Route exact path="/signup" component={Signup} />
              <Route
                exact
                path="/mypage"
                component={Mypage}
                render={() => {
                  if (isLogin) {
                    return <Mypage />;
                  } else {
                    return <Redirect to="/login" />;
                  }
                }}
              />
              <Route exact path="/deck/:deckKey" component={Deck} />
              <Route
                exact
                path="/add/:deckKey"
                component={AddCard}
                //render={() => {
                //  if (isLogin) {
                //    return <AddCard />;
                //  } else {
                //    return <Redirect to="/login" />;
                //  }
                //}}
              />
              <Route
                exact
                path="/study/:deckKey/:cardKey" //TODO: url에 :cardId 이런식으로 들어가려면 각 카드에 id가 있어야하긴 하겠네요 ㅠ
                component={Study}
                render={() => {
                  if (isLogin) {
                    return <Study />;
                  } else {
                    return <Redirect to="/login" />;
                  }
                }}
              />
              <Route
                exact
                path="/score/:deckKey" //TODO: url에 :cardId 이런식으로 들어가려면 각 카드에 id가 있어야하긴 하겠네요 ㅠ
                component={Score}
                render={() => {
                  if (isLogin) {
                    return <Score />;
                  } else {
                    return <Redirect to="/login" />;
                  }
                }}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
