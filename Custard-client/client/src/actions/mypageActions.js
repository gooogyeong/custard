import React from "react";
import firebase from "firebase/app";
import axios from "axios";
import LoginRoot from "../components/LoginRoot";
import { Link, Redirect } from "react-router-dom";
//import { UPDATE_USER_INFO } from "../../../../Wordmon-client/wordmon-client/src/actions/loginActions";
import { UserRef, getUserRef } from "../firebase";
import { User } from "../types";

axios.defaults.withCredentials = true;
//axios.defaults.headers.common['authorization'] = token ;

export const SET_UUID = "SET_UUID";
export const SET_LOGIN = "SET_LOGIN";
export const SET_SIGN_UP = "SET_SIGN_UP";
export const FINISH_SIGN_UP = "FINISH_SIGN_UP";
export const SET_TEMP_TOKEN = "SET_TEMP_TOKEN";
export const UPDATE_USER_INFO = "UPDATE_USER_INFO";
export const SIGN_OUT = "SIGN_OUT";

export function setCurrUUID(uuid) {
  return {
    type: SET_UUID,
    payload: {
      uuid: uuid,
    },
  };
}

export function setTempToken(token) {
  return {
    type: SET_TEMP_TOKEN,
    token: token,
  };
}

export function checkAuthPersistence() {
  return (dispatch) => {
    console.log("checkAuthPersistence");
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        //만약 로그인된 유저가 있다면 그중에 current user가 있는지 확인한다
        const currUser = firebase.auth().currentUser;
        if (currUser) {
          console.log(currUser.uid);
          dispatch(getUserInfo(currUser.uid)); //! dispatc
        }
      }
    });
  };
}

//! use .indexOn for better performance ?
export function getUserInfo(uuid) {
  console.log("getting user info");
  return (dispatch) => {
    UserRef.orderByChild("uuid")
      .equalTo(uuid)
      .once("value")
      .then((snap) => {
        if (snap.exists()) {
          const userKey = Object.keys(snap.val())[0];
          const user = snap.val()[userKey];
          console.log(user);
          dispatch(setUserInfo(user));
        }
      });
  };
}

export function checkIfRegistered(uuid) {
  console.log("check if sign up needed");
  return (dispatch) => {
    UserRef.orderByChild("uuid")
      .equalTo(uuid)
      .once("value")
      .then((snap) => {
        if (snap.exists()) {
          const userKey = Object.keys(snap.val())[0];
          const user = snap.val()[userKey];
          console.log(user);
          dispatch(setUserInfo(user));
        } else {
          console.log("you need to signup!");
          dispatch(setCurrUUID(uuid));
          dispatch(setSignUp());
        }
      });
  };
}

function setSignUp() {
  return {
    type: SET_SIGN_UP,
  };
}

export const createNewUser = (user /*:User*/) => {
  //auto-generated key를 사용하는 것에 대해: https://stackoverflow.com/questions/45898277/writing-firebase-database-without-using-their-auto-generated-key-in-android
  return (dispatch) => {
    console.log("creating new user");
    const newUserPath = UserRef.push().key;
    const currUserRef = getUserRef(newUserPath);
    currUserRef.set(user);
    dispatch(finishSignUp());
  };
};

const finishSignUp = () => {
  return {
    type: FINISH_SIGN_UP,
  };
};

export function updateUserImg(img) {
  return (dispatch) => {};
}

export function setUserInfo(user) {
  return {
    type: UPDATE_USER_INFO,
    payload: {
      userInfo: {
        uuid: user.id,
        email: user.email,
        username: user.username,
        image: user.image,
      },
    },
  };
}

export function register(newUser) {
  //TODO: dispatch 없애도!?
  return (dispatch) => {
    axios
      .post("http://localhost:4000/users/signup", {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
      })
      .then((response) => {
        console.log("가입성공");
      });
  };
}

// ! 작동하는 함수
export function login(user) {
  return (dispatch) => {
    axios
      .post("users/signin", {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        localStorage.setItem("usertoken", response.data); // * 토큰 데이터를 로컬 스토리지에 저장, 세션스토리지에 해야하나..?
        console.log("로그인 성공", response.data);
        localStorage.removeItem(localStorage); //* 얘는 로그 아웃할 때 써먹어야할 것이다.
        // return response.data;
        dispatch(setLogin());
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function setLogin() {
  return {
    type: SET_LOGIN,
  };
}

export function addProfile(profile) {
  return (dispatch) => {
    //const url = 'http://localhost:4000/user/profile';
    const formData = new FormData();
    formData.append("image", profile);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return axios
      .post("http://localhost:4000/users/profiles", formData, config)
      .then((res) => {
        console.log(res.data);
        dispatch(initUser()); //okkkk
      });
  };
}

export function initUser(uuid) {
  //const token = localStorage.usertoken;
  console.log("updating user info");
  console.log(uuid);
  //return async (dispatch) => {
  UserRef.orderByChild("uuid")
    .equalTo(uuid)
    .once("value")
    .then((snap) => {
      if (snap.exists()) {
        const userKey = Object.keys(snap.val())[0];
        const user = snap.val()[userKey];
        //console.log("registered user");
        //console.log(snap.val());
        console.log(user);
        //dispatch(setLogin());
        return (dispatch) => {
          dispatch(setUserInfo(user));
        };
      }
    });

  // axios
  //   .get("http://localhost:4000/users/profile", {
  //     headers: {
  //       authorization: token,
  //     },
  //   })
  //   .then((res) => {
  //     console.log(res);
  //     if (res.data == "no token") {
  //       dispatch(signOutInStore());
  //     } else {
  //       dispatch(setLogin());
  //       dispatch(setUserInfo(res.data));
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error.message);
  //   });
  //};
}

export function handleSignOut() {
  return (dispatch) => {
    // dispatch(setTempToken(result));
    axios.post("http://localhost:4000/users/signout").then(() => {
      dispatch(signOutInStore());
    });
  };
}

export function signOutInStore() {
  console.log("signout in store");
  return {
    type: SIGN_OUT,
  };
}

// export function addCustomer(file) {
//   return () => {
//     const url = "http://localhost:4000/user/profile";
//     const formData = new FormData();
//     formData.append("image", file);
//     const config = {
//       headers: {
//         "content-type": "multipart/form-data"
//       }
//     };
//     return axios.post(url, formData, config).then(response => {
//       console.log(response.data); //okkkk
//     });
//   };
// }
