import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import debounce from "lodash/debounce"; //* 이메일 인증 함수가 반복적으로 요청 되지 않기 하기 위한 라이브러리입니다.
import { Route, Link, Redirect } from "react-router-dom";
import LoginRoot from "./LoginRoot";
import { register } from "./UserFunctions";
import { Button } from "@material-ui/core";
import { UserRef, getUserRef, createNewUser } from "../firebase";

const SignUpWrapper = styled.div`
  text-align: center;
  margin: 0 0 0 250px;
  padding-left: 20px;
  .signup-form {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .signup-info {
    width: 300px;
    display: grid;
    grid-template-columns: 100px 1fr;
    grid-gap: 5px;
    margin-bottom: 10px;
  }
  .signup-info-field {
    text-align: right;
  }
  .signup-button-container {
    margin-top: 10px;
  }
`;

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: "",
      username: "", //*         유저이름
      isName: false, //*        이름 확인
      email: "", //*         이메일
      isEmail: false, //*        이메일 확인
      password: "", //*         비밀번호
      checkPassword: "", //*         비밀번호 확인
      errors: {},
      isSignup: false,
    };
    this.onClick = this.onClick.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleSignUpClick = this.handleSignUpClick.bind(this);
  }
  //* 이름 체크 하는 메서드
  //* username 필드에 새로운 값을 입력 할 때 마다 입력값이 인자로 전달.

  //* username이  두 글자 이상이면 유효하다
  checkedName = (username) => {
    if (username.length > 1) {
      this.setState({
        isName: true,
        username,
      });
    } else {
      this.setState({
        isName: false,
        username,
      });
    }
  };

  //* 이메일 체크 하는 메서드

  checkedEmail = debounce(async (email) => {
    const response = await axios.get("http://localhost:4000/users/signup");

    const users = response.data;
    const isUserFound = users.filter(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    ).length;

    isUserFound
      ? this.setState({
          email,
          isEmail: true,
        })
      : this.setState({
          email,
          isEmail: false,
        });
  }, 2000);
  // *함수 호출되에 0.3초 뒤에 실행하도록 설정 그 사이에 새로운 함수가 호출시, 기존 대기 시켰던 것 없애고 새로운 요청 대기
  //* 기존에는 한글자 타이핑 할 때마다 요청이 가서 서버 과부하 걸릴 수 있었는데, lodash 라이브러리를 이용 첫 타이핑이 끝난 후 요청이 가게 했다.
  //*  쉽게 말해 글자 입력 후 0.3초 뒤에 이미 있는지, 만들 수 있는 이메일인지에 대한 응답이 온다. (1초도 되고, 10초후에 반응 오게 할 수도 있다.)

  //? 이메일 등록 여부에 따라 보여주는 메시지
  emailFeedback() {
    if (this.state.email) {
      return this.state.isEmail ? (
        <div className="invalid-feedback">이미 등록되어 있는 이메일입니다</div>
      ) : (
        <div className="valid-feedback">사용할 수 있는 이메일입니다</div>
      );
    }
  }

  //* 패스워드 입력값 받아 state에 반영
  passwordInput(passwordInput) {
    this.setState({ password: passwordInput });
  }

  //* 패스워드 체크 값 입력 받아 반영
  checkPasswordInput(checkPasswordInput) {
    this.setState({ checkPassword: checkPasswordInput });
  }

  //? 패스워드 입력과 패스워드 체크 값이 일치하는 지 여부 확인
  passwordMatch() {
    const { password, checkPassword } = this.state;
    return password === checkPassword;
  }

  //? 패스워드와 패스워드체크 가 일치하지 않으면 보여주는 메시지
  passwordFeedback() {
    const { checkPassword } = this.state;

    if (checkPassword) {
      if (!this.passwordMatch()) {
        return (
          <div className="invalid-feedback">패스워드가 일치하지 않습니다</div>
        );
      }
    }
  }

  //* 회원가입시 보낼 데이터
  // ? 이미지의 경우에는 서버에서 이미지 컬럼의 디폴트 값으로 이미지를 주었습니다.
  onClick(e) {
    e.preventDefault();
    const newUser = {
      username: this.state.username, // * 이름
      email: this.state.email, // * 이메일
      //password: this.state.password // * 비밀번호
    };
    return axios
      .post("http://localhost:4000/users/signup", {
        username: newUser.username,
        email: newUser.email,
        googleIdToken: this.props.token,
      })
      .then((res) => {
        console.log(res);
        this.setState({ isSignup: true });
      });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handleSignUpClick() {
    //const newUserPath = UserRef.push().key;
    //const uuid = this.props.uuid;
    //const currUserRef = getUserRef(newUserPath);
    this.props.createNewUser({
      uuid: this.props.uuid,
      email: this.state.email,
      username: this.state.username,
    });
    // .then(() => {
    //   return <Redirect to="/login" />;
    // });

    //this.props.history.push("/login");
  }

  render() {
    console.log(!this.props.uuid);
    console.log(!this.props.isSignUp);
    if (!this.props.uuid || !this.props.isSignUp) {
      return <Redirect to="/login" />;
    }
    console.log(this.props.uuid);
    console.log(this.state);
    console.log(this.state.email);
    console.log(this.state.username);
    const { register } = this.props;
    return (
      <SignUpWrapper>
        <div className="app">
          <div className="row">
            <div className="signup-form">
              <div className="signup-info">
                <label className="signup-info-field" htmlFor="name">
                  user name{" "}
                </label>
                <input
                  type="text"
                  className=""
                  name="username"
                  id="nameInput"
                  placeholder=" enter custard user name"
                  onChange={(e) => this.setState({ username: e.target.value })}
                  required
                />
              </div>
              <div className="signup-info">
                <label className="signup-info-field" htmlFor="email">
                  email
                </label>
                <input
                  type="email"
                  className=""
                  name="email"
                  placeholder=" enter email"
                  id="emailInput"
                  aria-describedby="emailHelp"
                  onChange={(e) => this.setState({ email: e.target.value })}
                  required
                />
                {this.emailFeedback()}
              </div>
              <div className="signup-button-container">
                <Button onClick={this.handleSignUpClick} className="">
                  JOIN
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SignUpWrapper>
    );
  }
}
