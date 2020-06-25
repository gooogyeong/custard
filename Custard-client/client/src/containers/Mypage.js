import Mypage from "../components/Mypage";
import { connect } from "react-redux";
import {
  checkAuthPersistence,
  setLogin,
  setUserInfo,
  updateFirebaseStorage,
  addProfile,
  initUser,
  handleSignOut,
  signOutInStore,
} from "../actions/mypageActions";

//TODO: 얘 파일명 MypageContainer로 바꾸는거 안되는지 시도해보길 바람

const mapStateToProps = (state) => {
  return {
    mypage: state.mypage,
    //isLogin: state.mypage.isLogin,
    //uuid: state.mypage.uuid,
    //username: state.mypage.username
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // checkAuthPersistence: () => {
    //   checkAuthPersistence();
    // },
    setLogin: () => {
      dispatch(setLogin());
    },
    initUser: () => {
      dispatch(initUser());
    },
    updateFirebaseStorage: (userKey, file) => {
      dispatch(updateFirebaseStorage(userKey, file));
    },
    addProfile: (profile) => {
      dispatch(addProfile(profile));
    },
    handleSignOut: () => {
      dispatch(handleSignOut());
    },
    signOutInStore: () => {
      console.log("singout in store from container");
      dispatch(signOutInStore());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Mypage);
