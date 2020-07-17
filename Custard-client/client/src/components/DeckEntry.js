import React, { Component } from "react";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/core/styles";
import { TreeToggleIcon } from "./AllDeckList";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import Tooltip from "@material-ui/core/Tooltip";

const Deck = styled.div`
  //border: 1px solid red;
  display: flex;
  justify-content: space-between;
  //padding: 0 15px 0 0;
  margin: 8px 0 8px 0;
  .deck_entry {
    display: flex;
    flex-direction: row;
  }
`;

const DeckTitleContainer = styled.div`
  //border: 1px solid blue;
  width: 100%;
  background-color: rgb(243, 241, 241);
  margin: 0 0 6px 2px;
`;

//! sub_deck?
const DeckTitle = styled.input`
  //border: 1px solid black;
  display: inline;
  font-size: 18px;
  font-weight: 400;
  color: rgb(49, 49, 49);
  border-radius: 2px;
  background-color: inherit;
  //width: 100%;
  width: 400px;
  padding: 0 0 0 2px;
  &:hover {
    cursor: pointer;
  }
  input.sub_deck {
    cursor: pointer;
    font-size: 11pt;
    font-weight: 300;
    border-radius: 2px;
    background-color: rgb(253, 253, 241);
  }
`;

const LightEditIcon = materialStyled(EditIcon)({
  display: "none",
  color: "#bdbdbd",
});

const DeckTools = styled.div`
  //border: 2px solid blue;
  width: 80px;
  cursor: pointer;
`;

const NewSubDeck = styled.input`
  border: grey solid 3px;
  font-size: 14px;
  color: #bdbdbd;
  margin: 2px 0 2px 47px;
  width: 370px;
`;

class DeckEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: "",
      deckTitle: this.props.deck ? this.props.deck.title : "",
      showSubDeck: false,
      addNewSubDeck: false,
    };
    this.toggleSubDeck = this.toggleSubDeck.bind(this);
    this.handleStudyClick = this.handleStudyClick.bind(this);
    this.handleAddSubDeckClick = this.handleAddSubDeckClick.bind(this);
    this.handleDeckTitleChange = this.handleDeckTitleChange.bind(this);
    this.handleStopAdd = this.handleStopAdd.bind(this);
  }

  toggleSubDeck() {
    this.setState({ showSubDeck: !this.state.showSubDeck });
  }

  handleStudyClick(deckKey) {
    this.props.setCurrDeck(deckKey);
    this.props.history.push(`/deck/${deckKey}`);
  }

  handleAddSubDeckClick() {
    this.setState({
      addNewSubDeck: !this.state.addNewSubDeck,
    });
  }

  handleDeckTitleChange(newDeckTitle) {
    this.setState({ deckTitle: newDeckTitle });
  }

  handleStopAdd() {
    this.setState({ addNewSubDeck: false });
  }

  render() {
    const {
      userDecks,
      deck,
      setCurrDeck,
      deleteDeck,
      editDeckTitle,
      addSubDeck,
    } = this.props;
    return deck ? (
      <div key={deck.key}>
        <Deck
          style={
            deck.superDecks.length
              ? {
                  margin: `4px 0 4px ${20 * deck.superDecks.length}px`,
                }
              : {}
          }
        >
          <div className="deck_entry">
            {deck.subDecks.length !== 0 ? (
              <TreeToggleIcon
                style={
                  this.state.showSubDeck || this.state.addNewSubDeck
                    ? { transform: "rotateZ(90deg)" }
                    : {}
                }
                onClick={this.toggleSubDeck}
              />
            ) : (
              <TreeToggleIcon style={{ opacity: 0 }} />
            )}
            <DeckTitleContainer
              style={
                deck.superDecks.length
                  ? {
                      width: `${400 - 20 * deck.superDecks.length}px`,
                    }
                  : {}
              }
            >
              <DeckTitle
                className="category"
                style={
                  deck.superDecks.length !== 0
                    ? {
                        cursor: "pointer",
                        color: "#616161",
                        fontWeight: 300,
                        height: "24px",
                        borderRadius: "2px",
                        backgroundColor: "rgb(253, 253, 241)",
                        width: "100%",
                      }
                    : {}
                }
                type="text"
                disabled={false}
                value={this.state.deckTitle}
                onChange={(e) => {
                  this.handleDeckTitleChange(e.target.value);
                }}
                onBlur={(e) => {
                  editDeckTitle(deck.key, e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    editDeckTitle(deck.key, e.target.value);
                  }
                }}
              ></DeckTitle>
              <LightEditIcon />
            </DeckTitleContainer>
          </div>
          <DeckTools>
            <Tooltip title="study cards" placement="top">
              <ImportContactsIcon
                onClick={() => {
                  this.handleStudyClick(deck.key);
                }}
              />
            </Tooltip>
            <Tooltip title="add sub-deck" placement="top">
              <AddIcon
                onClick={() => {
                  this.handleAddSubDeckClick(deck.key);
                }}
              />
            </Tooltip>
            <Tooltip title="delete category" placement="top">
              <DeleteIcon
                onClick={() => {
                  alert("all cards and subdecks in the deck will be deleted");
                  deleteDeck(deck);
                }}
              />
            </Tooltip>
          </DeckTools>
        </Deck>
        <div
          className={
            this.state.addNewSubDeck || this.state.showSubDeck
              ? "active"
              : "nested"
          }
        >
          {deck.subDecks && (this.state.showSubDeck || this.state.addNewSubDeck)
            ? deck.subDecks.map((subDeckKey, j) => {
                const subDeck = userDecks.filter((deck, i) => {
                  return deck.key === subDeckKey;
                })[0];
                return (
                  <DeckEntry
                    history={this.props.history}
                    userDecks={userDecks}
                    deck={subDeck}
                    setCurrDeck={setCurrDeck}
                    editDeckTitle={editDeckTitle}
                    deleteDeck={deleteDeck}
                    addSubDeck={addSubDeck}
                  />
                );
              })
            : null}
          <NewSubDeck
            style={
              this.state.addNewSubDeck
                ? {
                    marginLeft: `${24 * (deck.superDecks.length + 1) + 19}px`,
                    width: `${370 - 24 * deck.superDecks.length + 7}px`,
                  }
                : { display: "none" }
            }
            className="newDeckInput"
            defaultValue="customize new deck"
            type="text"
            onClick={(e) => {
              e.target.value = "";
            }}
            onBlur={(e) => {
              if (e.target.value.length) {
                addSubDeck(deck.key, e.target.value);
                e.target.value = "";
              } else {
                this.handleStopAdd();
              }
            }}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                if (e.target.value.length) {
                  addSubDeck(deck.key, e.target.value);
                }
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>
    ) : null;
  }
}

export default DeckEntry;
