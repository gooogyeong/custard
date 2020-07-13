import React, { Component } from "react";
import { toJS } from "mobx";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/core/styles";
import { inject, observer } from "mobx-react";
import AddIcon from "@material-ui/icons/Add";
import PlayArrow from "@material-ui/icons/PlayArrow";
import "../styles/AllDeckList.css";
import OpenIconSpeedDial from "./OpenIconSpeedDial";
import { grey } from "@material-ui/core/colors";
import DeckEntry from "./DeckEntry";

const DeckListContainer = styled.div`
  width: 600px;
  min-height: 300px;
  margin: 0 0 0 250px;
  background-color: #ece3a9;
  padding-top: 20px;
  border-radius: 5px;
`;

export const TreeToggleIcon = materialStyled(PlayArrow)({
  cursor: "pointer",
});

@inject((stores) => ({
  userStore: stores.rootStore.userStore,
  deckStore: stores.rootStore.deckStore,
  cardStore: stores.rootStore.cardStore,
}))
@observer
class AllDeckList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: "",
      category: "",
    };
    this.newCategory = React.createRef(); //? 쓸모...?
    this.handleAddClick = this.handleAddClick.bind(this);
  }

  //TODO: category 수정할 때도 옆에 <EditIcon /> 눌렀을 시에만 수정 가능하도록 해야함
  handleAddSubDeckClick(deckKey) {
    this.setState({ addNewSubDeck: [this.state.addNewSubDeck, deckKey] });
  }

  handleAddClick() {
    this.setState({ action: "add_new_deck" });
  }

  componentDidMount() {
    this.props.deckStore.getUserDecks(this.props.userStore.uuid);
  }

  render() {
    const {
      userDecks,
      createDeck,
      editDeckTitle,
      setCurrDeck,
      deleteDeck,
      addSubDeck,
    } = this.props.deckStore;
    return (
      <DeckListContainer>
        {userDecks
          ? userDecks.map((deck, i) => {
              return deck.superDecks.length === 0 ? (
                <DeckEntry
                  history={this.props.history}
                  userDecks={userDecks}
                  deck={deck}
                  setCurrDeck={setCurrDeck}
                  editDeckTitle={editDeckTitle}
                  deleteDeck={deleteDeck}
                  addSubDeck={addSubDeck}
                />
              ) : null;
            })
          : null}
        {this.state.action === "add_new_deck" ? (
          <ul>
            {/*<TreeToggleIcon />*/}
            <input
              ref={this.newCategory}
              defaultValue="customize new deck"
              style={{ border: "3px black solid" }}
              type="text"
              onFocus={(e) => {
                e.target.value = "";
              }}
              onBlur={(e) => {
                if (e.target.value.length) {
                  createDeck(e.target.value);
                  e.target.value = "";
                } else {
                  alert("deck title should not be blank");
                }
              }}
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  if (e.target.value.length) {
                    createDeck(e.target.value);
                    e.target.value = "";
                  } else {
                    alert("deck title should not be blank");
                  }
                }
              }}
            ></input>
          </ul>
        ) : null}
        <OpenIconSpeedDial
          action={this.state.action}
          actions={[
            {
              icon: <AddIcon onClick={this.handleAddClick} />,
              name: "add new deck",
            },
          ]}
        />
      </DeckListContainer>
    );
  }
}

export default AllDeckList;
