import {observable, action, autorun} from "mobx";
import firebase from "firebase/app";
import moment from "moment";
import {
  provider,
  UserRef,
  DeckRef,
  profileRef,
  getUserRef,
  getDeckRef,
} from "../firebase";
import { User } from "../types";
//import { getUserInfo } from "../actions/mypageActions";

export class UserStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.checkIfRegistered = this.checkIfRegistered.bind(this);
    this.googleSignOut = this.googleSignOut.bind(this);
    this.storeSignIn = this.storeSignIn.bind(this);
    this.storeSignOut = this.storeSignOut.bind(this);
    this.endSignUp = this.endSignUp.bind(this);
    this.observeUserInfo = this.observeUserInfo.bind(this);
  }
  rootStore;

  @observable errMsg: string = null;
  @observable uuid: string = null;
  @observable isRegistered: boolean = null;
  @observable isLogin: boolean = null;
  @observable needSignUp: boolean = null;
  @observable userKey: string = null;
  @observable userName: string = "stranger";
  @observable profileImgURL: string = null; //! stranger한테도 디폴트 url img url 줘야하지 않을까

  @action
  setNeedSignUp() {
    this.needSignUp = true;
  }

  @action
  endSignUp() {
    this.needSignUp = false;
  }

  @action
  toggleSignUp() {
    this.needSignUp = !this.needSignUp;
  }

  @action
  storeSignIn() {
    this.isLogin = true;
  }

  @action
  storeSignOut() {
    this.isLogin = false;
  }

  @action
  observeUserInfo = (uuid: string) => {
    getUserRef(uuid).on(
      "value",
      function (snap) {
        if (snap.exists()) {
          this.setUserInfo(snap);
        }
      }.bind(this)
    );
  };

  createNewUser = async (user: User) => {
    //auto-generated key를 사용하는 것에 대해: https://stackoverflow.com/questions/45898277/writing-firebase-database-without-using-their-auto-generated-key-in-android
    const defaultProfileImgURL = await profileRef
      .child("profile_default.jpg")
      .getDownloadURL();
    user["profile_img_url"] = defaultProfileImgURL;
    const newUserPath = UserRef.push().key;
    const currUserRef = getUserRef(newUserPath);
    await currUserRef.set(user);
    await this.createFirstUserDeck();
    this.endSignUp();
  };

  createFirstUserDeck() {
    const initialDeckPath = DeckRef.push().key;
    const initialDeckRef = getDeckRef(initialDeckPath);
    initialDeckRef.set({
      key: initialDeckPath,
      uuid: this.uuid,
      author_id: this.uuid,
      title: "Customize your very first deck!",
      created_at: moment().format("YYYY.MM.DD HH:mm"),
      last_updated_at: moment().format("YYYY.MM.DD HH:mm"),
      cards: [],
      sub_decks: [],
      super_decks: [],
    });
  }

  @action
  setUserInfo(snap) {
    const userKey = Object.keys(snap.val())[0];
    const user = snap.val()[userKey];
    this.uuid = user.uuid;
    this.userKey = userKey;
    this.userName = user.username;
    this.profileImgURL = user["profile_img_url"];
  }

  getUserInfo(uuid) {
    UserRef.orderByChild("uuid")
      .equalTo(uuid)
      .on("value", (snap) => {
        if (snap.exists()) this.setUserInfo(snap);
      });
  }

  @action
  async checkIfRegistered(uuid) {
    let userSnapshot = null;
    await UserRef.orderByChild("uuid")
      .equalTo(uuid)
      .on(
        "value",
        function (snap) {
          if (snap.exists()) {
            console.log("user exists in custard db!");
            this.setUserInfo(snap);
            this.endSignUp();
            this.storeSignIn();
          } else {
            this.setNeedSignUp();
          }
        }.bind(this)
      );
  }

  @action
  checkAuthPersistence() {
    firebase.auth().onAuthStateChanged(
      function (user) {
        if (user) {
          // console.log('there is signed in user')
          //만약 로그인된 유저가 있다면 그중에 current user가 있는지 확인한다
          const currUser = firebase.auth().currentUser;
          if (currUser) {
            this.uuid = currUser.uid;
            this.checkIfRegistered(currUser.uid).then(
              function () {
                if (this.needSignUp === false) {
                  this.storeSignIn();
                  this.observeUserInfo(currUser.uid);
                }
              }.bind(this)
            );
          } else {
            this.errMsg = "unregistered user";
          }
        }
      }.bind(this)
    );
  }

  updateFirebaseStorage(userKey, fileObj) {
    const newProfileChild = profileRef.child(`profile_${userKey}`);
    const uploadFirebaseStorage = newProfileChild.put(fileObj);
    uploadFirebaseStorage.on("state_changed", function complete() {
      newProfileChild.getDownloadURL().then(async (url) => {
        const currUserRef = getUserRef(userKey);
        await currUserRef.update({ profile_img_url: url });
      });
    });
  }

  googleSignOut() {
    firebase.auth().signOut().then(this.storeSignOut);
  }
}
