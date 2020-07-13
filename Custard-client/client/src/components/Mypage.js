import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import "../styles/Mypage.css";

const MypageContainer = styled.div`
  padding: 10px 0 0 0;
  .welcome {
    min-width: 120px;
    display: flex;
    wrap: nowrap;
    font-size: 23px;
    margin: 20px 0 10px 276px;
    color: grey;
  }
`;

const ProfilePic = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 100%;
`;

const UploadContainer = styled.div`
  display: flex;
  wrap: nowrap;
  margin: 0 0 0 105px;
  padding: 3px;
`;

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
    const { isLogin, userName, profileImgURL } = this.props.userStore;
    if (!isLogin) {
      return <Redirect to="/login" />;
    }
    return (
      <MypageContainer>
        <div className="welcome">Hello, {userName}!</div>
        <div className="profile">
          <ProfilePic src={profileImgURL} alt="profile" />
        </div>
        <form onSubmit={this.handleFormSubmit}>
          <UploadContainer>
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
          </UploadContainer>
        </form>
        <Button id="logout-button" onClick={this.props.userStore.googleSignOut}>
          Sign out
        </Button>
      </MypageContainer>
    );
  }
}

export default Mypage;
