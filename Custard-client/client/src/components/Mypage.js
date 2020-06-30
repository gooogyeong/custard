import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Button } from "@material-ui/core";
import "../styles/Mypage.css";

@inject((stores) => ({
  userStore: stores.rootStore.userStore,
}))
@observer
class Mypage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileObj: null,
      fileName: "파일을 선택하세요",
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFileSaveClick = this.handleFileSaveClick.bind(this);
  }

  handleFileChange(e) {
    this.setState({
      fileObj: e.target.files[0],
      fileName: e.target.value,
    });
  }

  handleFileSaveClick() {
    this.props.userStore.updateFirebaseStorage(
      this.props.userStore.userKey,
      this.state.fileObj
    );
  }

  render() {
    const { uuid, isLogin, userName, profileImgURL } = this.props.userStore;
    console.log(this.props.userStore.userKey);
    console.log(this.state.fileObj);
    if (!isLogin) {
      return <Redirect to="/login" />;
    }
    return (
      <div className="mypage">
        <div className="welcome">Hello, {userName}!</div>
        <div className="profile">
          <img
            src={profileImgURL}
            alt="profile"
            style={{
              width: 180,
              height: 180,
              borderRadius: "100%",
            }}
          />
        </div>
        <form onSubmit={this.handleFormSubmit}>
          <div id="profile-uploader-container">
            <input
              className="custom-file-input"
              type="file"
              name="file"
              file={this.state.file}
              onChange={this.handleFileChange}
            />
            <button
              className="upload-button"
              type="submit"
              onClick={this.handleFileSaveClick}
            >
              저장
            </button>
          </div>
        </form>
        <Button id="logout-button" onClick={this.props.userStore.googleSignOut}>
          Sign out
        </Button>
      </div>
    );
  }
}

export default Mypage;
