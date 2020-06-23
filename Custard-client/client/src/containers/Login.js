import Login from "../components/Login";
import { connect } from "react-redux";
import {
  setCurrUUID,
  login,
  setLogin,
  initUser,
  setTempToken,
  setUserInfo,
} from "../actions/mypageActions";

//TODO: 얘 파일명 MypageContainer로 바꾸는거 안되는지 시도해보길 바람

function mapStateToProps(state) {
  return {
    uuid: state.mypage.uuid,
    isLogin: state.mypage.isLogin,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrUUID: (uuid) => {
      dispatch(setCurrUUID(uuid));
    },
    setUserInfo: (user) => {
      dispatch(setUserInfo(user));
    },
    setTempToken: (token) => {
      dispatch(setTempToken(token));
    },
    setLogin: () => {
      dispatch(setLogin());
    },
    login: (user) => {
      dispatch(login(user));
    },
    initUser: (uuid) => {
      dispatch(initUser(uuid));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
