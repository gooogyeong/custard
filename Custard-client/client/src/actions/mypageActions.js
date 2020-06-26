import firebase from "firebase/app";
import axios from "axios";
import { UserRef, getUserRef } from "../firebase";
import { profileRef } from "../firebase";

axios.defaults.withCredentials = true;

export const SET_UUID = "SET_UUID";
export const SET_USER_KEY = "SET_USER_KEY";
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

export function checkAuthPersistence() {
  return (dispatch) => {
    console.log("checkAuthPersistence");
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        //만약 로그인된 유저가 있다면 그중에 current user가 있는지 확인한다
        const currUser = firebase.auth().currentUser;
        if (currUser) {
          dispatch(getUserInfo(currUser.uid)); //! dispatc
        }
      }
    });
  };
}

export function updateFirebaseStorage(userKey, fileObj) {
  return (dispatch) => {
    const newProfileChild = profileRef.child(`profile_${userKey}`);
    const uploadFirebaseStorage = newProfileChild.put(fileObj);
    uploadFirebaseStorage.on("state_changed", function complete() {
      newProfileChild.getDownloadURL().then((url) => {
        const currUserRef = getUserRef(userKey);
        currUserRef.update({ profile_img_url: url });
      });
    });
  };
}

//! use .indexOn for better performance ?
export function getUserInfo(uuid) {
  return (dispatch) => {
    UserRef.orderByChild("uuid")
      .equalTo(uuid)
      .on("value", (snap) => {
        if (snap.exists()) {
          const userKey = Object.keys(snap.val())[0];
          const user = snap.val()[userKey];
          dispatch(setUserKey(userKey));
          dispatch(setUserInfo(user));
        }
      });
  };
}

export function checkIfRegistered(uuid) {
  return (dispatch) => {
    UserRef.orderByChild("uuid")
      .equalTo(uuid)
      .once("value")
      .then((snap) => {
        if (snap.exists()) {
          const userKey = Object.keys(snap.val())[0];
          const user = snap.val()[userKey];
          dispatch(setUserInfo(user));
        } else {
          dispatch(setCurrUUID(uuid));
          dispatch(setSignUp());
        }
      });
  };
}

function setUserKey(userKey) {
  return {
    type: SET_USER_KEY,
    payload: {
      userKey: userKey,
    },
  };
}

function setSignUp() {
  return {
    type: SET_SIGN_UP,
  };
}

export const createNewUser = (user /*:User*/) => {
  //auto-generated key를 사용하는 것에 대해: https://stackoverflow.com/questions/45898277/writing-firebase-database-without-using-their-auto-generated-key-in-android
  return async (dispatch) => {
    const defaultProfileImgURL = await profileRef
      .child("profile_default.jpg")
      .getDownloadURL();
    user["profile_img_url"] = defaultProfileImgURL;
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

export function setUserInfo(user) {
  return {
    type: UPDATE_USER_INFO,
    payload: {
      userInfo: {
        uuid: user.uuid,
        email: user.email,
        username: user.username,
        profileImgURL: user.profile_img_url,
      },
    },
  };
}

export function setLogin() {
  return {
    type: SET_LOGIN,
  };
}

export function initUser(uuid) {
  UserRef.orderByChild("uuid")
    .equalTo(uuid)
    .once("value")
    .then((snap) => {
      if (snap.exists()) {
        const userKey = Object.keys(snap.val())[0];
        const user = snap.val()[userKey];
        return (dispatch) => {
          dispatch(setUserInfo(user));
        };
      }
    });
}

export function handleSignOut() {
  return (dispatch) => {
    firebase.auth().signOut().then(dispatch(signOutInStore()));
  };
}

export function signOutInStore() {
  return {
    type: SIGN_OUT,
  };
}
