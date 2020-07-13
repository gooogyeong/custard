import React, { Component } from "react";
import { toJS } from "mobx";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { styled as materialStyled } from "@material-ui/core/styles";
import { TreeToggleIcon } from "./AllDeckList";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import Tooltip from "@material-ui/core/Tooltip";

const Deck = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0 15px 0 0;
  .deck_entry {
    display: flex;
    flex-direction: row;
  }
`;

const DeckTitleContainer = styled.div`
  background-color: rgb(243, 241, 241);
  margin: 0 0 6px 2px;
`;

const DeckTitle = styled.input`
  display: inline;
  font-size: 18px;
  font-weight: 400;
  color: rgb(49, 49, 49);
  border-radius: 2px;
  background-color: inherit;
  min-width: 300px;
  padding: 0 0 0 2px;
  &:hover {
    cursor: pointer;
  }
`;

const LightEditIcon = materialStyled(EditIcon)({
  display: "none",
  color: "#bdbdbd",
});

const DeckTools = styled.div``;

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
      <ul key={deck.key}>
        <Deck>
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
            ) : null}
            <DeckTitleContainer>
              <DeckTitle
                className="category"
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
                  alert("all cards in the deck will be deleted");
                  deleteDeck(deck);
                }}
              />
            </Tooltip>
          </DeckTools>
        </Deck>
        <li>
          <ul
            className={
              this.state.addNewSubDeck || this.state.showSubDeck
                ? "active"
                : "nested"
            }
          >
            {deck.subDecks &&
            (this.state.showSubDeck || this.state.addNewSubDeck)
              ? deck.subDecks.map((subDeckKey, j) => {
                  const subDeck = userDecks.filter((deck, i) => {
                    return deck.key === subDeckKey;
                  })[0];
                  return (
                    <DeckEntry
                      className="sub_deck"
                      history={this.props.history}
                      userDecks={userDecks}
                      deck={subDeck}
                      setCurrDeck={setCurrDeck}
                      editDeckTitle={editDeckTitle}
                      deleteDeck={deleteDeck}
                      addSubDeck={addSubDeck}
                    />
                    /*<li key={subDeckKey}>
                      <div>
                        <Link
                        //to={
                        //  cate.Decks[j].isEditing
                        //    ? "/decks"
                        //    : `/deck/${cate.category}/${singleDeck.title}`
                        //}
                        >
                          <input
                            type="text"
                            className="deck-title"
                            disabled={
                              false
                              //cate.Decks[j].isEditing ? false : true
                            }
                            value={subDeck.title}
                            onBlur={(e) => {
                              console.log("no longer editing");
                              //this.props.editDeckInServer(
                              //  singleDeck.id,
                              //  e.target.value
                              //);
                              //this.props.disactivateDeckInput(i, j);
                            }}
                            onKeyUp={function (e) {
                              if (e.keyCode === 13) {
                                //this.props.editDeckInServer(
                                //singleDeck.id,
                                //e.target.value
                                //);
                                //this.props.disactivateDeckInput(i, j);
                              }
                            }.bind(this)}
                            onChange={(e) => {
                              this.props.editDeckTitle(i, j, e.target.value);
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
                          <Tooltip title="delete deck" placement="right">
                            <DeleteIcon
                              onClick={() => {
                                this.props
                                  .deleteDeck
                                  //cate.category,
                                  //singleDeck.id
                                  ();
                                this.props.updateUserDecks();
                              }}
                            />
                          </Tooltip>
                        </span>
                      </div>
                            </li>*/
                  );
                })
              : null}
            <input
              style={this.state.addNewSubDeck ? {} : { display: "none" }}
              className="newDeckInput"
              type="text"
              onBlur={(e) => {
                if (e.target.value.length) {
                  addSubDeck(deck.key, e.target.value);
                }
                e.target.value = "";
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
          </ul>
        </li>
      </ul>
    ) : null;
  }
}

export default DeckEntry;
