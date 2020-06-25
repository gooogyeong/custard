import {
  SET_UUID,
  SET_USER_KEY,
  SET_SIGN_UP,
  FINISH_SIGN_UP,
} from "../actions/mypageActions";

const initialState = {
  uuid: "",
  userKey: "",
  email: "",
  username: "stranger",
  isLogin: false, //true, //TODO: default값 false로 바꿔야함,
  profileImgURL: "",
  image: "",
  //"https://cookingwithdog.com/wp-content/uploads/2017/01/custard-pudding-00.jpg",
  token: "",
  isSignUp: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_UUID:
      return Object.assign({}, state, { uuid: action.payload.uuid });
    case SET_USER_KEY:
      return Object.assign({}, state, { userKey: action.payload.userKey });
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
        uuid: action.payload.userInfo.uuid,
        email: action.payload.userInfo.email,
        username: action.payload.userInfo.username,
        profileImgURL: action.payload.userInfo.profileImgURL,
      });
    case "SIGN_OUT":
      return Object.assign({}, state, { isLogin: false });
    default:
      return state;
  }
};

export default reducer;
