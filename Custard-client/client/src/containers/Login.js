import Login from "../components/Login";
import { connect } from "react-redux";
import {
  checkAuthPersistence,
  checkIfRegistered,
  createNewUser,
  setCurrUUID,
  setLogin,
  initUser,
  setUserInfo,
} from "../actions/mypageActions";

//TODO: 얘 파일명 MypageContainer로 바꾸는거 안되는지 시도해보길 바람

function mapStateToProps(state) {
  return {
    uuid: state.mypage.uuid,
    isLogin: state.mypage.isLogin,
    isSignUp: state.mypage.isSignUp,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    checkAuthPersistence: () => {
      dispatch(checkAuthPersistence());
    },
    checkIfRegistered: (uuid) => {
      dispatch(checkIfRegistered(uuid));
    },
    setCurrUUID: (uuid) => {
      dispatch(setCurrUUID(uuid));
    },
    createNewUser: (user) => {
      dispatch(createNewUser(user));
    },
    setUserInfo: (user) => {
      dispatch(setUserInfo(user));
    },
    setLogin: () => {
      dispatch(setLogin());
    },
    initUser: (uuid) => {
      dispatch(initUser(uuid));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
