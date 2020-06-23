import Signup from "../components/Signup";
import { connect } from "react-redux";
import { register, initUser } from "../actions/mypageActions";

//TODO: 얘 파일명 SignupContainer로 바꾸는거 안되는지 시도해보길 바람

function mapStateToProps(state) {
  return {
    token: state.mypage.token,
    uuid: state.mypage.uuid,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    register: (newUser) => {
      dispatch(register(newUser));
    },
    initUser: () => {
      dispatch(initUser());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
