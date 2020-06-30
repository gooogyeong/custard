import React, { Component } from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import { Link, Redirect } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import "../styles/AllDeckList.css";
import OpenIconSpeedDial from "./OpenIconSpeedDial";

//TODO: edit 함수들 작성해야함

@inject((stores) => ({
  userStore: stores.rootStore.userStore,
  deckStore: stores.rootStore.deckStore,
}))
@observer
class AllDeckList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speedDialActions: [
        {
          icon: <AddIcon onClick={this.props.activateInput} />,
          name: "add category",
        },
      ],
      //* decks: this.props.decks,
      //? decks => category
      // category: "this.props.category",
      category: "",
      addingFirstDeckToCategory: false,
    };
    this.newCategory = React.createRef(); //? 쓸모...?
    this.addFirstDeckToCategory = this.addFirstDeckToCategory.bind(this);
  }

  addFirstDeckToCategory() {
    this.setState({ addingFirstDeckToCategory: true });
  }

  //TODO: category 수정할 때도 옆에 <EditIcon /> 눌렀을 시에만 수정 가능하도록 해야함
  //toggleAttribute라는 기능이 있는 거 같던데 참고
  handleAddDeckButtonClick(e) {
    console.log(e.target);
    if (e.target.parentElement.parentElement.className === "caret") {
      e.target.parentElement.parentElement.className = "caret-down";
    }
    if (e.target.parentElement.nextSibling.children[0]) {
      if (
        e.target.parentElement.nextSibling.children[0].className === "nested"
      ) {
        e.target.parentElement.nextSibling.children[0].className = "active";
      }
    }
    if (e.target.parentElement.nextElementSibling.children[0].lastChild) {
      e.target.parentElement.nextElementSibling.children[0].lastChild.style = {};
    }
  }

  //TODO: 이러지말고 각 deck에 willReceiveNewDeck 이런 속성을 만들면 될 거같은데? refactoring 필요할듯.
  handleDeckCategoryToggle(e) {
    //참고: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_treeview
    console.log(e.target);
    if (e.target.className === "caret" || e.target.className === "caret-down") {
      if (e.target.className === "caret") {
        e.target.className = "caret-down";
      } else if (e.target.className === "caret-down") {
        e.target.className = "caret";
      }
      if (e.target.children[2].children[0].className === "nested") {
        e.target.children[2].children[0].className = "active";
      } else if (e.target.children[2].children[0].className === "active") {
        e.target.children[2].children[0].className = "nested";
      } else {
      }
    } else {
      return;
    }
  }

  componentDidMount() {
    this.props.deckStore.getUserDecks(this.props.userStore.uuid);
  }

  render() {
    const { uuid } = this.props.userStore;
    const { userDecks } = this.props.deckStore;
    console.log(toJS(userDecks));
    return (
      <div className="deck-list">
        {userDecks
          ? userDecks.map((cate, i) => {
              return (
                <ul
                  id={cate.category}
                  className="caret"
                  onClick={(e) => {
                    this.handleDeckCategoryToggle(e);
                  }}
                >
                  <input
                    className="category"
                    type="text"
                    disabled={false}
                    value={cate.title}
                    onChange={(e) => {
                      this.setState({ category: e.target.value });
                      cate.category = e.target.value;
                      this.props.editCateTitle(cate.id);
                    }}
                    onBlur={(e) => {
                      //마우스가 input 필드가 아닌 다른 곳을 클릭할 때 수정이 끝난 것으로 간주
                      this.setState({ category: e.target.value });
                      this.props.editCateInServer(cate.id, e.target.value);
                      this.props.editCateTitle(cate.id);
                      this.props.updateUserDecks();
                      //? this.props.disactivateDeckInput(i, j);
                    }}
                    onKeyUp={function (e) {
                      //엔터 쳤을때도 마찬가지로 수정 종료된 것으로 간주
                      if (e.keyCode === 13) {
                        this.props.editCateInServer(cate.id, e.target.value);
                        this.props.editCateTitle(cate.id);
                        this.props.updateUserDecks();
                        //? this.props.disactivateDeckInput(i, j);
                      }
                    }.bind(this)}
                  ></input>
                  <span className="category-tool">
                    <Tooltip title="add deck" placement="left">
                      <AddIcon
                        //TODO: 도움말 추가
                        onClick={this.handleAddDeckButtonClick.bind(this)}
                      />
                    </Tooltip>
                    {/* <EditIcon
                  //? 꼭 필요한지 잘 모르겠음...
                  onClick={() => {
                    this.props.editCateInServer(cate.id, cate.category);
                    this.props.editCateTitle(cate.id);
                  }}
                /> */}
                    <Tooltip title="delete category" placement="right">
                      <DeleteIcon
                        onClick={function () {
                          this.props.deleteCategory(cate.id);
                          //TODO: 카테고리가 지워질 경우, 덱도 전부 지워집니다. Y/N 경고 창이 필요
                          alert("delete all?");
                          this.props.updateUserDecks();
                        }.bind(this)}
                      />
                    </Tooltip>
                  </span>
                  <li>
                    <ul className="nested">
                      {cate.Decks
                        ? cate.Decks.map((singleDeck, j) => {
                            return singleDeck["user_id"] === uuid ? (
                              <li id={`${cate.category} ${singleDeck.title}`}>
                                <div>
                                  <Link
                                    to={
                                      cate.Decks[j].isEditing
                                        ? "/decks"
                                        : `/deck/${cate.category}/${singleDeck.title}`
                                    }
                                  >
                                    <input
                                      type="text"
                                      className="deck-title"
                                      disabled={
                                        cate.Decks[j].isEditing ? false : true
                                      }
                                      value={singleDeck.title}
                                      onBlur={(e) => {
                                        //마우스가 input 필드가 아닌 다른 곳을 클릭할 때 수정이 끝난 것으로 간주
                                        console.log("no longer editing");
                                        this.props.editDeckInServer(
                                          singleDeck.id,
                                          e.target.value
                                        );
                                        this.props.disactivateDeckInput(i, j);
                                      }}
                                      onKeyUp={function (e) {
                                        //엔터 쳤을때도 마찬가지로 수정 종료된 것으로 간주
                                        if (e.keyCode === 13) {
                                          this.props.editDeckInServer(
                                            singleDeck.id,
                                            e.target.value
                                          );
                                          this.props.disactivateDeckInput(i, j);
                                        }
                                      }.bind(this)}
                                      onChange={(e) => {
                                        this.props.editDeckTitle(
                                          i,
                                          j,
                                          e.target.value
                                        );
                                      }}
                                    ></input>
                                  </Link>
                                  <span className="deck-tool">
                                    <Tooltip title="edit deck" placement="left">
                                      <EditIcon
                                        onClick={() => {
                                          this.props.activateDeckInput(i, j);
                                        }}
                                      />
                                    </Tooltip>
                                    <Tooltip
                                      title="delete deck"
                                      placement="right"
                                    >
                                      <DeleteIcon
                                        onClick={() => {
                                          this.props.deleteDeck(
                                            cate.category,
                                            singleDeck.id
                                          );
                                          this.props.updateUserDecks();
                                        }}
                                      />
                                    </Tooltip>
                                  </span>
                                </div>
                              </li>
                            ) : null;
                          })
                        : null}
                      <input
                        style={{ display: "none" }}
                        className="newDeckInput"
                        type="text"
                        onBlur={function (e) {
                          if (e.keyCode === 13) {
                            if (e.target.value.length) {
                              this.props.addDeck(uuid, cate.id, e.target.value);
                              this.props.updateUserDecks();
                            }
                            e.target.value = "";
                          }
                        }.bind(this)}
                        onKeyUp={function (e) {
                          if (e.keyCode === 13) {
                            if (e.target.value.length) {
                              this.props.addDeck(uuid, cate.id, e.target.value);
                              this.props.updateUserDecks();
                            }
                            e.target.value = "";
                          }
                        }.bind(this)}
                      />
                    </ul>
                  </li>
                </ul>
              );
            })
          : null}
        {this.props.action === "add_category" ? (
          <ul className="caret-down">
            <input
              ref={this.newCategory}
              defaultValue="add new category"
              style={{ border: "3px black solid" }}
              type="text"
              onFocus={(e) => {
                e.target.value = "";
              }}
              onBlur={function (e) {
                if (e.target.value.length) {
                  this.props.addCategory(uuid, this.newCategory.current.value);
                  this.props.updateUserDecks();
                }
              }.bind(this)}
              onKeyUp={function (e) {
                if (e.keyCode === 13) {
                  if (e.target.value.length) {
                    this.props.addCategory(
                      uuid,
                      this.newCategory.current.value
                    );
                    this.props.updateUserDecks();
                  }
                }
              }.bind(this)}
            ></input>
          </ul>
        ) : null}
        <OpenIconSpeedDial
          action={this.props.action}
          actions={this.state.speedDialActions}
        />
      </div>
    );
  }
}

export default AllDeckList;
