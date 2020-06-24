import React, { Component } from "react";
import firebase from "firebase/app";
import { Link, Redirect, withRouter } from "react-router-dom";
import { Button } from "@material-ui/core";
// import { login } from "./UserFunctions";
import GoogleLogin from "react-google-login";
import { GOOGLE_CLIENT_ID } from "../config/googleClientId";
import axios from "axios";
//import google_logo from "../google_logo.png";
import google_logo_2 from "../google_logo_2.png";
import "../styles/Login.css";
import { provider, UserRef, getUserRef } from "../firebase/index.ts";
import { onSignInClick } from "../firebase";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //tempToken: "",
      needSignUp: false,
    };
    this.handleSignInSuccess = this.handleSignInSuccess.bind(this);
  }

  handleSignInSuccess(res) {
    //! on? once?
    this.props.checkIfRegistered(res.user.uid);
    console.log(res.user.uid);
    // UserRef.orderByChild("uuid")
    //   .equalTo(res.user.uid)
    //   .once("value", (snap) => {
    //     if (!snap.exists()) {
    //       this.props.history.push("/signup");
    //     } else {
    //       console.log("registered user");
    //       console.log(snap.val());
    //       const userKey = Object.keys(snap.val())[0];
    //       const user = snap.val()[userKey];
    //       this.props.setUserInfo(user);
    //       this.props.history.push("/mypage");
    //     }
    //   });
    // 아예 google signin이 처음인 경우
    // const isUnregistered =
    //   res.additionalUserInfo.isNewUser ||
    //   firebase.auth().currentUser.metadata.creationTime ===
    //     firebase.auth().currentUser.metadata.lastSignInTime;

    // 토큰
    //const token = res.credential.accessToken;
    //localStorage.setItem("usertoken", token);
  }

  async handleSignInClick() {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(this.handleSignInSuccess)
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }

  handleSignUp() {}

  componentDidMount() {
    //this.props.checkAuthPersistence();
  }

  render() {
    // console.log(this.props.isLogin);
    if (this.props.isLogin) {
      return <Redirect to="/mypage" />; //!mypage
    }
    console.log(this.props.isSignUp);
    if (this.props.isSignUp) {
      console.log("you gotta signup");
      this.props.history.push("/signup");
      //return <Redirect to="/signup" />;
    }
    return (
      <div className="login" style={{ padding: "40px 0 0 0" }}>
        <Button
          id="google-login-button"
          onClick={this.handleSignInClick.bind(this)}
        >
          <img src={google_logo_2} className="google-logo" />
          Sign in with Google
        </Button>
      </div>
    );
  }
}

export default withRouter(Login);
