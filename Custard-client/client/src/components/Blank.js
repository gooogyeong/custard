import React, { Component, PureComponent } from "react";
import ReactHtmlParser from "react-html-parser";
import JsxParser from "react-jsx-parser";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FlareIcon from "@material-ui/icons/Flare";

import "../styles/Blank.css";

class Answer extends Component {
  render() {
    return <span></span>;
  }
}

export default class Blank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHint: false,
      showAnswer: false,
      submittedAnswerArr: [],
      blankCount: 0,
      correctClicked: false,
      wrongClicked: false,
      doubleSubmit: false,
    };
    this.answerSubmitForm = React.createRef();
    this.showHint = this.showHint.bind(this);
    this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this);
    this.doubleSubmitCheck = this.doubleSubmitCheck.bind(this);
  }

  showHint() {
    this.setState({ showHint: true });
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
  //* correct, wrong 클릭 이벤트

  keyGenerator() {
    this.setState({ blankCount: this.state.blankCount + 1 });
    return this.state.blankCount;
  }

  handleAnswerSubmit(e) {
    if (e.keyCode === 13) {
      const newSubmittedAnswerArr = [];
      for (
        let i = 0;
        i < this.answerSubmitForm.current.children[1].children.length;
        i++
      ) {
        newSubmittedAnswerArr.push(
          this.answerSubmitForm.current.children[1].children[i].value
        );
        this.answerSubmitForm.current.children[1].children[i].disabled = true;
      }
      /*console.log(this.props.cardId);
      for (let i = 0; i < this.props.cards.length; i++) {
        if (this.props.cards[i].id === this.props.cardId) {
          console.log("correct answer: ");
          console.log(this.props.cards[i]["answer_target"]);
        }
      }*/
      this.setState({
        showAnswer: true,
        submittedAnswerArr: newSubmittedAnswerArr,
      });
    }
  }

  render() {
    const {
      currStudyCard,
      correctClicked,
      wrongClicked,
      handleOkayClick,
      handleWrongClick,
    } = this.props;
    let n = 0;
    let answer = currStudyCard.answer.replace(
      /{{[0-99999]/g,
      "<span style={answerStyle}>"
    );
    answer = answer.replace(/}}/g, "</span>");
    const splitAnswerArr = currStudyCard.answer
      .split(/{|}/)
      .map(function (answer, i) {
        if (parseInt(answer[0])) {
          return `<input key=${i} style="border: 3px black solid"></input>`;
        }
        return answer;
      })
      .join("");
    return (
      <div id="blank">
        <Grid container spacing={1} className="blank_container">
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
              <CardHeader subheader="Blank" className="blank_header" />
              <CardContent style={{ backgroundColor: "#faf9f2" }}>
                {currStudyCard.hint ? (
                  <Tooltip title="hint" placement="right">
                    <FlareIcon
                      style={{ float: "right" }}
                      onClick={this.showHint}
                    >
                      show hint
                    </FlareIcon>
                  </Tooltip>
                ) : null}
                <br></br>
                {
                  <div
                    ref={this.answerSubmitForm}
                    onKeyUp={this.handleAnswerSubmit}
                  >
                    <div>
                      <h4>Question</h4>
                      <div>{currStudyCard.question}</div>
                    </div>
                    <br></br>
                    {this.state.showHint && currStudyCard.hint ? (
                      <div>
                        <h4>Hint</h4>
                        <div>{currStudyCard.hint}</div>
                      </div>
                    ) : null}
                    <br></br>
                    {this.state.showAnswer ? (
                      <JsxParser
                        bindings={{
                          answerStyle: {
                            borderRadius: 3,
                            backgroundColor: "#ffef96",
                          },
                        }}
                        components={{ Answer }}
                        jsx={answer}
                      />
                    ) : null}
                    <h4>Answer</h4>
                    <div>{ReactHtmlParser(splitAnswerArr)}</div>
                    <br></br>
                  </div>
                }
              </CardContent>
              {this.state.showAnswer === true ? (
                <div>
                  <CardActions>
                    {wrongClicked === false ? (
                      <Button
                        className="blank_button"
                        variant="contained"
                        color="default"
                        onClick={handleOkayClick}
                      >
                        okay
                      </Button>
                    ) : (
                      <Button className="blank_button" disabled={true}>
                        okay
                      </Button>
                    )}
                    {correctClicked === false ? (
                      <Button
                        className="blank_button"
                        variant="contained"
                        color="default"
                        onClick={handleWrongClick}
                      >
                        wrong
                      </Button>
                    ) : (
                      <Button className="blank_button" disabled={true}>
                        wrong
                      </Button>
                    )}
                  </CardActions>
                </div>
              ) : null}
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}
