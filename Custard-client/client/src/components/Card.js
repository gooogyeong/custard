import React, { Component } from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import { Link as RouterLink } from "react-router-dom";
import { Formik } from "formik";
import { withStyles } from "@material-ui/core/styles";
// import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import DeckSpeedDial from "./DeckSpeedDial";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CardType from "./selectMenu/CardType";

import "../styles/Card.css";
import { brown } from "@material-ui/core/colors";
import { editQuestion } from "../actions/cardActions";

const styles = {
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 500,
    width: 500,
  },
};

@inject((stores) => ({
  userStore: stores.rootStore.userStore,
  deckStore: stores.rootStore.deckStore,
  cardStore: stores.rootStore.cardStore,
}))
@observer
class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DeckSpeedDialActions: [
        {
          icon: <AddCircleIcon />,
          name: "add cards",
        },
      ],
      answerTargetCount: 1,
      isEditing: false,
    };
    this.handleAnswerInputKeyUp = this.handleAnswerInputKeyUp.bind(this);
  }

  handleCardType(cardType) {
    this.setState({ cardType: cardType });
  }

  //수정시에도 Ctrl + Shift + s 단축키 사용가능하도록 추가
  handleAnswerInputKeyUp(i, e) {
    const wholeText = e.target.value;
    const selectedText = document.getSelection().toString();
    //console.log(selectedText);
    const count = this.state.answerTargetCount;
    const markedUpText =
      wholeText.slice(0, wholeText.indexOf(selectedText)) +
      "{{" +
      count +
      selectedText +
      "}}" +
      wholeText.slice(wholeText.indexOf(selectedText) + selectedText.length);

    console.log(markedUpText);
    e.target.value = markedUpText;
  }

  componentDidMount() {
    if (!this.props.deckStore.currDeck) {
      this.props.deckStore.setCurrDeck(this.props.match.params.deckKey);
    }
    if (!this.props.deckStore.userDecks) {
      this.props.deckStore.getUserDecks(this.props.userStore.uuid);
    }
    this.props.cardStore.getDeckCards(this.props.match.params.deckKey);
  }

  handleEditing() {
    this.setState({ isEditing: true });
  }
  handleStopEditing() {
    this.setState({ isEditing: false });
  }

  render() {
    const {
      currDeck,
      deleteCard,
      editCardType,
      editQuestion,
      editAnswer,
      editHint,
    } = this.props.deckStore;
    const { currDeckCards } = this.props.cardStore;
    return currDeck /*&& currDeckCards*/ ? (
      <div id="card">
        <Grid container spacing={3} className="card_container">
          {
            <Grid container spacing={0} className="card_header">
              <Grid item xs={12} sm={12} md={12} className="card_title">
                <h3>{currDeck.title}</h3>
              </Grid>
              <Grid item xs={12} sm={12} md={12} className="card_study">
                <Button
                  id="card_study_button"
                  onClick={function () {
                    if (currDeckCards) {
                      this.props.cardStore.setCurrStudyCard(
                        currDeckCards[0].key
                      );
                      this.props.history.push(
                        `/study/${this.props.match.params.deckKey}/${currDeckCards[0].key}`
                      );
                    } else {
                      this.props.history.push(
                        `/deck/${this.props.match.params.deckKey}`
                      );
                    }
                  }.bind(this)}
                >
                  Study
                </Button>
              </Grid>
            </Grid>
          }
          {currDeckCards
            ? currDeckCards.map((card, idx) => {
                return (
                  <Formik
                    initialValues={{
                      cardKey: card.key,
                      cardtype: card.cardType,
                      question: card.question,
                      answer: card.answer,
                      answer_target: card.answer_target,
                      hint: card.hint,
                    }}
                    enableReinitialize={true}
                    onSubmit={(values, { setSubmitting }) => {
                      setSubmitting(true);
                    }}
                  >
                    {({ values, isSubmitting, handleChange, handleSubmit }) => {
                      //* Formik에서는 values props로 state 관리
                      return (
                        <form onSubmit={handleSubmit}>
                          <Grid
                            container
                            spacing={1}
                            className="card_content"
                            direction="row"
                            justify="center"
                            alignItems="center"
                          >
                            <Grid
                              item
                              xs={6}
                              sm={6}
                              md={6}
                              className="card_cardtype"
                            >
                              <div>Card{idx + 1}</div>
                              <CardType
                                className="card_cardtype_button"
                                values={values}
                                handleCardType={this.handleCardType.bind(this)}
                                editCardType={editCardType}
                              />
                              <br />
                            </Grid>
                            <Grid xs={6} sm={6} md={6}>
                              <Button className="card_button">
                                <Tooltip title="delete card" placement="right">
                                  <DeleteIcon
                                    onClick={() => {
                                      deleteCard(card.key);
                                    }}
                                  />
                                </Tooltip>
                              </Button>
                              <Button type="submit" className="card_button">
                                <Tooltip title="edit card" placement="left">
                                  <EditIcon
                                    onClick={function () {
                                      this.handleEditing();
                                    }.bind(this)}
                                  />
                                </Tooltip>
                              </Button>
                            </Grid>
                          </Grid>
                          <div className="card_text_container">
                            <Grid container spacing={3} className="card_text">
                              <Grid item xs={12} sm={12} md={12}>
                                <div>Question. {idx + 1}</div>
                                <TextField
                                  fullWidth
                                  style={{
                                    backgroundColor: "#fcfbe9",
                                    borderRadius: "3px",
                                    color: brown,
                                  }}
                                  name="question"
                                  disabled={this.state.isEditing ? false : true}
                                  type="text"
                                  multiline
                                  variant="outlined"
                                  rows="5"
                                  value={values.question}
                                  onChange={(e) => {
                                    handleChange(e);
                                    values.question = e.target.value;
                                  }}
                                  onBlur={() => {
                                    editQuestion(
                                      values.cardKey,
                                      values.question
                                    );
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} md={12}>
                                <br />
                                &nbsp;Answer. {idx + 1}
                                <TextField
                                  fullWidth
                                  style={{
                                    backgroundColor: "#fcfbe9",
                                    borderRadius: "3px",
                                    color: brown,
                                  }}
                                  name="answer"
                                  disabled={this.state.isEditing ? false : true}
                                  type="text"
                                  multiline
                                  variant="outlined"
                                  rows="5"
                                  value={values.answer}
                                  onChange={(e) => {
                                    if (
                                      e.ctrlKey &&
                                      e.shiftKey &&
                                      e.which == 83
                                    ) {
                                      this.handleAnswerInputKeyUp(idx, e);
                                    }
                                    handleChange(e);
                                    values.answer = e.target.value;
                                  }}
                                  onBlur={() => {
                                    editAnswer(values.cardKey, values.answer);
                                  }}
                                  onKeyUp={(e) => {
                                    if (
                                      e.ctrlKey &&
                                      e.shiftKey &&
                                      e.which == 83
                                    ) {
                                      this.handleAnswerInputKeyUp(idx, e);
                                      handleChange(e);
                                      values.answer = e.target.value;
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} md={12}>
                                <br />
                                &nbsp;Hint. {idx + 1}
                                <TextField
                                  fullWidth
                                  style={{
                                    backgroundColor: "#fcfbe9",
                                    borderRadius: "3px",
                                    color: brown,
                                  }}
                                  name="hint"
                                  disabled={this.state.isEditing ? false : true}
                                  type="text"
                                  multiline
                                  variant="outlined"
                                  rows="5"
                                  value={values.hint}
                                  onChange={(e) => {
                                    handleChange(e);
                                    values.hint = e.target.value;
                                  }}
                                  onBlur={() => {
                                    editHint(values.cardKey, values.hint);
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <br />
                          </div>
                          <br />
                          <br />
                        </form>
                      );
                    }}
                  </Formik>
                );
              })
            : null}
          <Grid container>
            <Grid item xs={12} sm={12} md={12}>
              {
                <Link
                  component={RouterLink}
                  to={`/add/${this.props.match.params.deckKey}`}
                >
                  <DeckSpeedDial
                    className="card_dial"
                    actions={this.state.DeckSpeedDialActions}
                  />
                </Link>
              }
            </Grid>
          </Grid>
        </Grid>
      </div>
    ) : null;
  }
}

export default withStyles(styles)(Card);
