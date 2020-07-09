import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FlareIcon from "@material-ui/icons/Flare";

import "../styles/Flashcard.css";

//TODO: 별표 아이콘 -> 누르면 card.marked = true

class Flashcard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAnswer: false,
      showHint: false,
      correctClicked: false,
      wrongClicked: false,
      doubleSubmit: false,
    };
    this.showHint = this.showHint.bind(this);
    this.showAnswer = this.showAnswer.bind(this);
    this.doubleSubmitCheck = this.doubleSubmitCheck.bind(this);
  }

  showHint() {
    this.setState({ showHint: true });
  }

  showAnswer() {
    this.setState({ showAnswer: true });
  }
  //* correct, wrong click된 상태에 따라 wrong, correct disable
  handleCorrect() {
    this.setState({ correctClicked: true });
  }

  handleWrong() {
    this.setState({ wrongClicked: true });
  }
  //* correct, wrong 중복 클릭 방지
  doubleSubmitCheck() {
    if (this.state.doubleSubmit) {
      return this.state.doubleSubmit;
    } else {
      this.setState({ doubleSubmit: true });
      return false;
    }
  }

  componentDidMount() {
    console.log("flashcard");
  }

  render() {
    const {
      currStudyCard,
      handleOkayClick,
      handleWrongClick,
      correctClicked,
      wrongClicked,
    } = this.props;
    return (
      <div id="flashcard">
        <Grid container spacing={1} className="flashcard_container">
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            justify="center"
            alignItems="center"
            className="flashcard_content"
          >
            <Card variant="outlined">
              <CardHeader subheader="Flashcard" className="flashcard_header" />
              {
                <div>
                  <CardContent style={{ backgroundColor: "#faf9f2" }}>
                    <div>
                      <Tooltip title="hint" placement="right">
                        <FlareIcon
                          className="show_hint"
                          style={{ float: "right" }}
                          onClick={() => {
                            this.showHint();
                            //this.props.handleHintedInServer(cardId);
                            //this.props.handleHintedPost(cardId);
                            this.props.getDeckCards();
                          }}
                        >
                          show hint
                        </FlareIcon>
                      </Tooltip>
                    </div>
                    <br></br>
                    <CardContent>
                      <div className="flashcard_Q">
                        <div style={{ fontWeight: "bold" }}>
                          <br></br>Question
                        </div>
                        {currStudyCard.question}
                      </div>
                      <br></br>
                      {this.state.showHint === true ? (
                        <div className="flashcard_H">
                          <div style={{ fontWeight: "bold" }}>
                            <br></br>Hint
                          </div>
                          {currStudyCard.hint}
                        </div>
                      ) : null}
                      <br></br>
                      {this.state.showAnswer === true ? (
                        <div className="flashcard_A">
                          <div style={{ fontWeight: "bold" }}>
                            <br></br>Answer
                          </div>
                          {currStudyCard.answer}
                        </div>
                      ) : null}
                    </CardContent>
                    <br></br>
                  </CardContent>
                  {this.state.showAnswer === true ? (
                    <div>
                      <CardActions>
                        {wrongClicked === false ? (
                          <Button
                            className="flashcard_button"
                            variant="contained"
                            color="default"
                            onClick={handleOkayClick}
                          >
                            okay
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            disabled
                            className="flashcard_button"
                          >
                            okay
                          </Button>
                        )}
                        {correctClicked === false ? (
                          <Button
                            className="flashcard_button"
                            variant="contained"
                            color="default"
                            onClick={handleWrongClick}
                          >
                            wrong
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            disabled
                            className="flashcard_button"
                          >
                            wrong
                          </Button>
                        )}
                      </CardActions>
                    </div>
                  ) : (
                    <Button
                      onClick={this.showAnswer}
                      variant="contained"
                      color="default"
                      fullWidth
                      className="flash_answer_button"
                    >
                      show answer
                    </Button>
                  )}
                </div>
              }
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Flashcard;
