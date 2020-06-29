import { observable, action } from "mobx";
import firebase from "firebase/app";
import { UserRef, getUserRef } from "../firebase";

export class UserStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  rootStore;

  @observable uuid: string = null;
  @observable userKey: string = null;
  @observable userName: string = "stranger";
  @observable profileImgURL: string = null; //! stranger한테도 디폴트 url img url 줘야하지 않을까

  checkAuthPersistence() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        //만약 로그인된 유저가 있다면 그중에 current user가 있는지 확인한다
        const currUser = firebase.auth().currentUser;
        if (currUser) {
          this.getUserInfo(currUser.uid);
        }
      }
    });
  }

  @action
  getUserInfo(uuid) {
    return (dispatch) => {
      UserRef.orderByChild("uuid")
        .equalTo(uuid)
        .on("value", (snap) => {
          if (snap.exists()) {
            const userKey = Object.keys(snap.val())[0];
            const user = snap.val()[userKey];
            this.uuid = user.uuid;
            this.userKey = userKey;
            this.userName = user.username;
            this.profileImgURL = user.profile_img_url;
          }
        });
    };
  }
}
