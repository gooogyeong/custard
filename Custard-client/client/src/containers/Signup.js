import Signup from "../components/Signup";
import { connect } from "react-redux";
import { createNewUser, initUser } from "../actions/mypageActions";

//TODO: 얘 파일명 SignupContainer로 바꾸는거 안되는지 시도해보길 바람

function mapStateToProps(state) {
  return {
    token: state.mypage.token,
    uuid: state.mypage.uuid,
    isSignUp: state.mypage.isSignUp,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createNewUser: (user) => {
      dispatch(createNewUser(user));
    },
    initUser: () => {
      dispatch(initUser());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
