import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import firebase from "firebase/app";
import { Link, Redirect, withRouter } from "react-router-dom";
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

  // componentDidMount() {
  //   console.log("login component did mount");
  //   this.props.userStore.checkAuthPersistence();
  // }

  async googleSignIn() {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(
        function (res) {
          console.log(res.user.uid);
          this.props.userStore.checkIfRegistered(res.user.uid).then(
            function (snap) {
              console.log(snap);
              if (snap) {
                console.log("found user snap!");
                this.props.userStore.setUserInfo(snap);
                this.props.userStore.storeSignIn();
                this.props.userStore.observeUserInfo(res.user.uid);
                //this.props.history.push("/mypage");
              } else {
                console.log("no user snap");
                this.props.userStore.setNeedSignUp();
              }
            }.bind(this)
          );
        }.bind(this)
      );
  }

  render() {
    const { uuid, isLogin, needSignUp, googleSignIn } = this.props.userStore;
    console.log(isLogin);
    if (isLogin) {
      return <Redirect to="/mypage" />; //!mypage
    }
    if (needSignUp) {
      this.props.history.push("/signup");
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
