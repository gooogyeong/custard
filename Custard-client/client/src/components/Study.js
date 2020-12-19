import React, { Component } from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import { AnswerType } from "../types";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Bookmark from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";

import Flashcard from "./Flashcard";
import Blank from "./Blank";
// import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";

import "../styles/Study.css";

@inject((stores) => ({
  deckStore: stores.rootStore.deckStore,
  cardStore: stores.rootStore.cardStore,
}))
@observer
class Study extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: false,
      hint: false,
      answerSubmitted: false,
      correctClicked: false,
      wrongClicked: false,
      isMarked: false,
    };
    this.showAnswer = this.showAnswer.bind(this);
    this.showHint = this.showHint.bind(this);
    this.hideAnswer = this.hideAnswer.bind(this);
    this.hideHint = this.hideHint.bind(this);
    this.handleMarkedTrue = this.handleMarkedTrue.bind(this);
    this.handleMarkedFalse = this.handleMarkedFalse.bind(this);
    this.resetAnswerSubmitted = this.resetAnswerSubmitted.bind(this);
    this.handleOkayClick = this.handleOkayClick.bind(this);
    this.handleWrongClick = this.handleWrongClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
  }

  showAnswer() {
    this.setState({ answer: true });
  }

  showHint() {
    this.setState({ hint: true });
  }

  hideAnswer() {
    this.setState({ answer: false });
  }

  hideHint() {
    this.setState({ hint: false });
  }

  componentDidMount() {
    if (!this.props.deckStore.currDeck) {
      this.props.deckStore.setCurrDeck(this.props.match.params.deckKey);
    }
    if (!this.props.deckStore.currStudyCard) {
      console.log(this.props.match.params.cardKey);
      this.props.cardStore.setCurrStudyCard(this.props.match.params.cardKey);
    }
  }

  handleMarkedTrue() {
    this.setState({ isMarked: true });
  }

  handleMarkedFalse() {
    this.setState({ isMarked: false });
  }

  setAnswerSubmitted() {
    this.setState({ answerSubmitted: true });
  }

  resetAnswerSubmitted() {
    this.setState({
      answerSubmitted: false,
      correctClicked: false,
      wrongClicked: false,
    });
  }

  handleOkayClick() {
    if (this.state.answerSubmitted) {
      alert("already submitted");
    } else {
      this.setState({ answerSubmitted: true, correctClicked: true });
      this.props.cardStore.handleAnswerSubmit(
        this.props.cardStore.currStudyCard.key,
        AnswerType.correct
      );
    }
  }

  handleWrongClick() {
    if (this.state.answerSubmitted) {
      alert("already submitted");
    } else {
      this.setState({ answerSubmitted: true, wrongClicked: true });
      this.props.cardStore.handleAnswerSubmit(
        this.props.cardStore.currStudyCard.key,
        AnswerType.wrong
      );
    }
  }

  handleNextClick() {
    if (!this.state.answerSubmitted) {
      alert("submit answer to move on");
    } else {
      const {
        currDeckCards,
        currDeckCardKeys,
        currStudyCard,
      } = this.props.cardStore;
      this.hideHint();
      this.hideAnswer();
      const currCardIdx =
        currDeckCardKeys && currStudyCard
          ? currDeckCardKeys.indexOf(currStudyCard.key)
          : null;
      this.props.cardStore.setCurrStudyCard(currDeckCards[currCardIdx + 1].key);
      this.resetAnswerSubmitted();
      this.props.history.push(
        `/study/${this.props.deckStore.currDeck.key}/${
          currDeckCards[currCardIdx + 1].key
        }`
      );
    }
  }

  render() {
    const { currDeck, handleCorrect, handleWrong } = this.props.deckStore;
    const {
      currDeckCards,
      currDeckCardKeys,
      currStudyCard,
      handleAnswerSubmit,
    } = this.props.cardStore;
    console.log(currDeckCardKeys);
    const currCardIdx = currStudyCard
      ? currDeckCardKeys.indexOf(currStudyCard.key)
      : null;
    return currStudyCard ? (
      <div id="study-container">
        <Grid container spacing={1} className="study_container">
          <Grid
            item
            xs={12}
            sm={10}
            md={8}
            alignItems="flex-start"
            className="study_content"
          >
            <Card variant="contained">
              <Tooltip title="bookmark" placement="right">
                <CardHeader
                  title="Study"
                  subheader={currDeck.title}
                  action={
                    !this.state.isMarked ? (
                      <Bookmark
                        style={{ float: "right" }}
                        onClick={() => {
                          this.setState({ isMarked: true });
                        }}
                      />
                    ) : (
                      <BookmarkIcon
                        style={{ float: "right" }}
                        onClick={() => {
                          this.setState({ isMarked: false });
                        }}
                      />
                    )
                  }
                />
              </Tooltip>
              <CardContent>
                {currStudyCard.cardType === "flashcard" ? ( //{
                  <Flashcard
                    answer={this.state.answer}
                    hint={this.state.hint}
                    showAnswer={this.showAnswer}
                    showHint={this.showHint}
                    currStudyCard={currStudyCard}
                    correctClicked={this.state.correctClicked}
                    wrongClicked={this.state.wrongClicked}
                    handleAnswerSubmit={handleAnswerSubmit}
                    AnswerType={AnswerType}
                    handleOkayClick={this.handleOkayClick}
                    handleWrongClick={this.handleWrongClick}
                  />
                ) : (
                  <Blank
                    answer={this.state.answer}
                    hitn={this.state.hint}
                    showAnswer={this.showAnswer}
                    showHint={this.showHint}
                    currStudyCard={currStudyCard}
                    correctClicked={this.state.correctClicked}
                    wrongClicked={this.state.wrongClicked}
                    handleAnswerSubmit={handleAnswerSubmit}
                    handleOkayClick={this.handleOkayClick}
                    handleWrongClick={this.handleWrongClick}
                  />
                )}
              </CardContent>
              <CardActions>
                {currCardIdx === 0 ? (
                  <Link
                    component={RouterLink}
                    to={`/deck/${currStudyCard.key}`}
                  >
                    <Button className="study_button" variant="outlined">
                      Back to Deck
                    </Button>
                  </Link>
                ) : (
                  <Link
                    component={RouterLink}
                    to={`/study/${currStudyCard.key}`}
                  >
                    <Button className="study_button" variant="outlined">
                      previous card
                    </Button>
                  </Link>
                )}
                {currCardIdx === currDeckCards.length - 1 ? (
                  <Link
                    component={RouterLink}
                    to={{
                      pathname: `/score/${currDeck.key}`,
                      state: {
                        currDeckCards: currDeckCards,
                        currDeckKey: currDeck.Key,
                      },
                    }}
                  >
                    <Button className="study_button" variant="outlined">
                      finish
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="study_button"
                    variant="outlined"
                    onClick={this.handleNextClick}
                  >
                    next card
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </div>
    ) : null;
  }
}

export default Study;
