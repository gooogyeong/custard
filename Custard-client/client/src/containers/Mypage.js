import Mypage from "../components/Mypage";
import { connect } from "react-redux";
import {
  setLogin,
  updateFirebaseStorage,
  initUser,
  handleSignOut,
} from "../actions/mypageActions";

//TODO: 얘 파일명 MypageContainer로 바꾸는거 안되는지 시도해보길 바람

const mapStateToProps = (state) => {
  return {
    mypage: state.mypage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLogin: () => {
      dispatch(setLogin());
    },
    initUser: () => {
      dispatch(initUser());
    },
    updateFirebaseStorage: (userKey, file) => {
      dispatch(updateFirebaseStorage(userKey, file));
    },
    handleSignOut: () => {
      dispatch(handleSignOut());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Mypage);
