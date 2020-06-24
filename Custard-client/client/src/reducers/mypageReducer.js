import {
  SET_UUID,
  SET_SIGN_UP,
  FINISH_SIGN_UP,
} from "../actions/mypageActions";

const initialState = {
  uuid: "",
  email: "",
  username: "stranger",
  isLogin: false, //true, //TODO: default값 false로 바꿔야함
  image: "",
  //"https://cookingwithdog.com/wp-content/uploads/2017/01/custard-pudding-00.jpg",
  token: "",
  isSignUp: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_UUID:
      return Object.assign({}, state, { uuid: action.payload.uuid });
    case "SET_TEMP_TOKEN":
      return Object.assign({}, state, { token: action.token });
    case "SET_LOGIN":
      return Object.assign({}, state, { isLogin: true });
    case SET_SIGN_UP:
      return Object.assign({}, state, { isSignUp: true });
    case FINISH_SIGN_UP:
      return Object.assign({}, state, { isSignUp: false });
    case "UPDATE_USER_INFO":
      return Object.assign({}, state, {
        isLogin: true,
        uuid: action.payload.userInfo.id,
        email: action.payload.userInfo.email,
        username: action.payload.userInfo.username,
        image: action.payload.userInfo.image,
      });
    case "SIGN_OUT":
      return Object.assign({}, state, { isLogin: false });
    default:
      return state;
  }
};

export default reducer;
