import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import firebase from "firebase/app";
import { withRouter } from "react-router-dom";
import { Button } from "@material-ui/core";
import google_logo_2 from "../google_logo_2.png";
import "../styles/Login.css";
import { provider } from "../firebase/index.ts";

@inject((stores) => ({
  userStore: stores.rootStore.userStore,
}))
@observer
class Login extends Component {
  constructor(props) {
    super(props);
    this.googleSignIn = this.googleSignIn.bind(this);
  }

  async googleSignIn() {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(
        function (res) {
          this.props.userStore.checkIfRegistered(res.user.uid);
        }.bind(this)
      )
      .then(
        function () {
          if (this.props.userStore.needSignUp) {
            this.props.history.push("/signup");
          } else {
            this.props.userStore.storeSignIn();
            this.props.userStore.observeUserInfo(this.props.userStore.uuid);
          }
        }.bind(this)
      );
  }

  render() {
    const { isLogin } = this.props.userStore;
    if (isLogin) {
      this.props.history.push("/mypage");
    }
    return (
      <div className="login" style={{ padding: "40px 0 0 0" }}>
        <Button id="google-login-button" onClick={this.googleSignIn}>
          <img src={google_logo_2} className="google-logo" />
          Sign in with Google
        </Button>
      </div>
    );
  }
}

export default withRouter(Login);
