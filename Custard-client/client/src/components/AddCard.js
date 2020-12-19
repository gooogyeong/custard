import React from "react";
import { inject, observer } from "mobx-react";
import moment from "moment";
import { CardType } from "../types";
import AddTextType from "./selectMenu/AddTextType";
import CSV from "./textType/FileUploader_csv";
import Image from "./textType/FileUploader_image";
import PlainText from "./textType/PlainText";
import JSON from "./textType/FileUploader_json";
import DetectText from "./textType/Detect_text_image";
import TextEditor from "./textType/TextEditor";

// import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AddBoxIcon from "@material-ui/icons/AddBox";

import "../styles/AddCard.css";

@inject((stores) => ({
  userStore: stores.rootStore.userStore,
  deckStore: stores.rootStore.deckStore,
}))
@observer
class AddCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addCardForm: [
        {
          question: "",
          answer: "",
          note: "",
        },
      ],
      answerTargetCount: 1,
    };
    this.handleAddCard = this.handleAddCard.bind(this);
    this.refObjArr = [];
    this.addCardForm = this.addCardForm.bind(this);
    this.handleCardTypeChange = this.handleCardTypeChange.bind(this);
    this.handleInputQuestion = this.handleInputQuestion.bind(this);
    this.handleInputAnswer = this.handleInputAnswer.bind(this);
    this.handleAnswerInputKeyUp = this.handleAnswerInputKeyUp.bind(this);
    this.handleInputNote = this.handleInputNote.bind(this);

    this.handleCSV = this.handleCSV.bind(this);
    this.handleTable = this.handleTable.bind(this);
    this.handleJSON = this.handleJSON.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.handleDetect = this.handleDetect.bind(this);
  }

  //? AddCard > AddCardMenu(textType) props
  handleTextTypeChange(textType) {
    this.setState({ textType: textType });
  }

  //* addCardForm 추가
  addCardForm() {
    const newAddCardForm = [...this.state.addCardForm];
    newAddCardForm.push({
      cardType: "",
      question: "",
      answer: "",
      note: "",
    });
    this.setState({ addCardForm: newAddCardForm });
  }

  //? AddCard > AddCardType props
  handleCardTypeChange(i, cardType /*cardType*/) {
    // this.setState({ cardType: cardType });
    const newAddCardForm = [...this.state.addCardForm];
    newAddCardForm[i].cardType = cardType;
    this.setState({ addCardForm: newAddCardForm });
  }

  //* question, answer, note input state 관리 함수
  handleInputQuestion(i, e) {
    const newAddCardForm = [...this.state.addCardForm];
    newAddCardForm[i].question = e.target.value;
    this.setState({ addCardForm: newAddCardForm });
  }

  handleInputAnswer(i, e) {
    if (e.target.value.length < 2500) {
      const newAddCardForm = [...this.state.addCardForm];
      newAddCardForm[i].answer = e.target.value;
      this.setState({ addCardForm: newAddCardForm });
    } else {
      // alert("2500자 이상입니다");
    }
  }

  handleInputNote(i, e) {
    const newAddCardForm = [...this.state.addCardForm];
    newAddCardForm[i].note = e.target.value;
    this.setState({ addCardForm: newAddCardForm });
  }
  //*****************************************************/

  //* (Ctrl + Shift + s clicked 클릭 시) 자동 마크업
  handleAnswerInputKeyUp(i, e) {
    if (e.ctrlKey && e.shiftKey && e.which == 83) {
      console.log("Ctrl + Shift + s clicked");
      const wholeText = e.target.value;
      const selectedText = document.getSelection().toString();
      const count = this.state.answerTargetCount;
      const markedUpText =
        wholeText.slice(0, wholeText.indexOf(selectedText)) +
        "{{" +
        count +
        selectedText +
        "}}" +
        wholeText.slice(wholeText.indexOf(selectedText) + selectedText.length);
      console.log(markedUpText);
      const newAddCardForm = [...this.state.addCardForm];
      newAddCardForm[i].answer = markedUpText;
      console.log(newAddCardForm);
      this.setState({
        addCardForm: newAddCardForm,
        answerTargetCount: count + 1,
      });
      console.log(this.state.addCardForm);
    }
  }
  //*********************************************************************/

  //* addCardForm 추가 & state 초기화
  //handleInputReset(e) {
  handleAddCard(e) {
    // 페이지 리로딩 방지
    e.preventDefault();
    //? category => cate_route
    const { /*cate_route, title*/ deckKey } = this.props.match.params;
    //const { category } = this.props;
    /*let deckId;
    for (let i = 0; i < category.length; i++) {
      if (category[i].category === cate_route) {
        for (let j = 0; j < category[i].Decks.length; j++) {
          if (category[i].Decks[j].title === title) {
            deckId = category[i].Decks[j].id;
          }
        }
      }
    }*/
    console.log(deckKey);
    let validAddCardForm = [];
    console.log();
    let validCardType = null;
    let validAnswerField = null;
    for (let i = 0; i < this.state.addCardForm.length; i++) {
      if (
        this.state.addCardForm[i].cardType &&
        this.state.addCardForm[i].answer
      ) {
        validAddCardForm.push(this.state.addCardForm[i]);
      } else if (!this.state.addCardForm[i].cardType) validCardType = false;
      else if (!this.state.addCardForm[i].cardType) validAnswerField = false;
    }
    if (validCardType === false) {
      alert("choose card type for each card");
      return;
    } else if (validAnswerField === false) {
      alert("fill out answer field for each card");
      return;
    }
    //this.props.addCard(/*cardType, */ category, deckId, validAddCardForm);

    const pattern = /\{.*?\}/g; //{{1corona virus}} 이 형태의 string을 골라내고 있음
    for (let i = 0; i < validAddCardForm.length; i++) {
      //validAddCardForm[i].deckKey = this.props.match.params.deckKey;
      const answerTarget = validAddCardForm[i].answer.match(pattern);
      if (validAddCardForm[i].cardType === CardType.fill && !answerTarget) {
        alert("should have at least one blank");
        return;
        //TODO: fill-in-the-blank 타입의 카드에서는 최소 하나의 빈칸을 지정해야한다는 모달창 뜨도록 만들어야함
      } else if (
        validAddCardForm[i].cardType === CardType.fill &&
        answerTarget
      ) {
        const answerTargetArr = [];
        for (let i = 0; i < answerTarget.length; i++) {
          if (!answerTargetArr[parseInt(answerTarget[i][2]) - 1]) {
            answerTargetArr.push(
              answerTarget[i].slice(3, answerTarget[i].length - 1)
            );
          } else {
            const str = answerTargetArr[parseInt(answerTarget[i][2]) - 1];
            answerTargetArr[parseInt(answerTarget[i][2]) - 1] = [
              str,
              answerTarget[i].slice(3, answerTarget[i].length - 1),
            ];
          }
        }
        validAddCardForm[i]["answer_target"] = answerTargetArr;
      } else if (validAddCardForm[i].cardType === CardType.flash) {
        validAddCardForm[i]["answer_target"] = null;
      }
      //validAddCardForm[i].cardType = validAddCardForm[i].cardType;
    }
    this.props.deckStore.createNewCards(deckKey, validAddCardForm);
    this.setState({
      addCardForm: [
        {
          cardType: "",
          question: "",
          answer: "",
          note: "",
        },
      ],
    });
  }

  //* textType에 따른 question, answer, (note) state 관리 *************/
  //? AddCard > CSV, JSON, Image props
  handleCSV(csvData) {
    for (let i = 0; i < csvData.length; i++) {
      if (i === 0) {
        const csvAddCard = [...this.state.addCardForm];
        // csvAddCard[i].question = csvData[i];
        csvAddCard[i].answer = csvData[i].toString(); //* answer는 필수
        this.setState({ addCardForm: csvAddCard });
      } else if (i > 0) {
        this.addCardForm();
        const csvAddCard = [...this.state.addCardForm];
        csvAddCard[i].answer = csvData[i].toString(); //* answer는 필수
        this.setState({ addCardForm: csvAddCard });
      }
    }
  }

  handleTable(tableArr) {
    const newAddCardForm = [...this.state.addCardForm];
    let rowCounter = 0;
    for (let i = 0; i < tableArr.length; i++) {
      //tableArr[i] = 테이블 하나
      let answerColIdx = null;
      let questionColIdx = null;
      let noteColIdx = null;
      console.log(tableArr[i][0]); // ["question", "answer", "note"], ["answer", "question"]
      for (let j = 0; j < tableArr[i][0].length; j++) {
        console.log([i][0][j]);
        if (tableArr[i][0][j] == "answer") {
          answerColIdx = j;
        } else if (tableArr[i][0][j] == "question") {
          questionColIdx = j;
        } else if (tableArr[i][0][j] == "note") {
          noteColIdx = j;
        }
      }
      for (let j = 1; j < tableArr[i].length; j++) {
        if (!newAddCardForm[rowCounter]) {
          //row 하나당 cardForm 한개씩 추가
          newAddCardForm.push({
            question: "",
            answer: "",
            note: "",
          });
        }
        for (let k = 0; k < tableArr[i][j].length; k++) {
          //tableArr[i][j].length = number of columns
          if (k === questionColIdx) {
            newAddCardForm[rowCounter].question = tableArr[i][j][k];
          } else if (k === answerColIdx) {
            newAddCardForm[rowCounter].answer = tableArr[i][j][k];
          } else if (k === noteColIdx) {
            newAddCardForm[rowCounter].note = tableArr[i][j][k];
          }
        }
        rowCounter++;
      }
    }

    this.setState({ addCardForm: newAddCardForm });
  }

  handleJSON(jsonData) {
    for (let i = 0; i < jsonData.length; i++) {
      if (i === 0) {
        const jsonAddCard = [...this.state.addCardForm];
        jsonAddCard[i].question = jsonData[i].translation;
        jsonAddCard[i].answer = jsonData[i].subtitle; //* answer는 필수
        jsonAddCard[i].note = jsonData[i].videoTitle;
        this.setState({ addCardForm: jsonAddCard });
      } else if (i > 0) {
        this.addCardForm();
        const jsonAddCard = [...this.state.addCardForm];
        jsonAddCard[i].question = jsonData[i].translation;
        jsonAddCard[i].answer = jsonData[i].subtitle; //* answer는 필수
        jsonAddCard[i].note = jsonData[i].videoTitle;
        this.setState({ addCardForm: jsonAddCard });
      }
    }
  }

  handleImage(imageData) {
    console.log("imageData_addCard: ", imageData);
    const imageAddCard = [...this.state.addCardForm];
    imageAddCard[0].answer = imageData; //* answer는 필수
    this.setState({ addCardForm: imageAddCard });
  }

  //? 구두점?
  handleDetect(imageText) {
    console.log("imageText_addCard: ", imageText);
    const textAddCard = [...this.state.addCardForm];
    textAddCard[0].answer = imageText; //* answer는 필수
    // imageAddCard[0].question = imageData;
    this.setState({ addCardForm: textAddCard });
  }
  //******************************************************************/
  componentDidMount() {
    //this.props.updateUserDecks(/*this.props.userId*/);
  }

  render() {
    //? AddCard > PlainText props
    const { textType /*, addCardForm*/ } = this.state;
    return (
      <div>
        <AddTextType
          //id="add-text-type"
          style={{ margin: "0 0 30px 0" }}
          handleTextTypeChange={this.handleTextTypeChange.bind(this)}
        />
        {/* <AddCardType
          handleCardTypeChange={this.handleCardTypeChange.bind(this)}
        /> */}
        {/*<AddBoxIcon onClick={this.addCardForm.bind(this)} />*/}
        {/* //! IIFE 사용(가능하면 리팩토링) */}
        {(() => {
          // eslint-disable-next-line default-case
          switch (textType) {
            case "plain text":
              return (
                <div>
                  <div className="add-cardform-button">
                    <AddBoxIcon onClick={this.addCardForm.bind(this)} />
                  </div>
                  <PlainText
                    handleCardTypeChange={this.handleCardTypeChange}
                    addCardForm={this.state.addCardForm}
                    handleInputQuestion={this.handleInputQuestion}
                    handleInputAnswer={this.handleInputAnswer}
                    handleAnswerInputKeyUp={this.handleAnswerInputKeyUp}
                    handleInputNote={this.handleInputNote}
                    //questionInput={this.state.addCardForm[i].question} //
                  />
                </div>
              );
            case "table":
              return (
                <div>
                  <div className="filler"></div>
                  <CSV
                    handleCSV={this.handleCSV}
                    handleTable={this.handleTable}
                  />
                  <div className="add-cardform-button">
                    <AddBoxIcon onClick={this.addCardForm.bind(this)} />
                  </div>
                  <PlainText
                    addCardForm={this.state.addCardForm}
                    handleCardTypeChange={this.handleCardTypeChange}
                    handleInputQuestion={this.handleInputQuestion}
                    handleInputAnswer={this.handleInputAnswer}
                    handleAnswerInputKeyUp={this.handleAnswerInputKeyUp}
                    handleInputNote={this.handleInputNote}
                  />
                </div>
              );
            case "json":
              return (
                <div>
                  <JSON handleJSON={this.handleJSON} />
                  <span></span>
                  <br></br>
                  <AddBoxIcon
                    id="add-cardform-button-json"
                    onClick={this.addCardForm.bind(this)}
                  />
                  <PlainText
                    addNewCardForm={this.addCardForm.bind(this)}
                    addCardForm={this.state.addCardForm}
                    handleCardTypeChange={this.handleCardTypeChange}
                    handleInputQuestion={this.handleInputQuestion}
                    handleInputAnswer={this.handleInputAnswer}
                    handleAnswerInputKeyUp={this.handleAnswerInputKeyUp}
                    handleInputNote={this.handleInputNote}
                  />
                </div>
              );
            case "image":
              return (
                <div>
                  <Image handleImage={this.handleImage} />
                  <div className="add-cardform-button">
                    <AddBoxIcon onClick={this.addCardForm.bind(this)} />
                  </div>
                  <PlainText
                    addCardForm={this.state.addCardForm}
                    handleCardTypeChange={this.handleCardTypeChange}
                    handleInputQuestion={this.handleInputQuestion}
                    handleInputAnswer={this.handleInputAnswer}
                    handleAnswerInputKeyUp={this.handleAnswerInputKeyUp}
                    handleInputNote={this.handleInputNote}
                  />
                </div>
              );
            case "text recognition":
              return (
                <div>
                  <div className="filler"></div>
                  <DetectText
                    handleCSV={this.handleCSV}
                    handleTable={this.handleTable}
                    handleDetect={this.handleDetect}
                  />
                  <div className="add-cardform-button">
                    <AddBoxIcon onClick={this.addCardForm.bind(this)} />
                  </div>
                  <PlainText
                    addCardForm={this.state.addCardForm}
                    handleCardTypeChange={this.handleCardTypeChange}
                    handleInputQuestion={this.handleInputQuestion}
                    handleInputAnswer={this.handleInputAnswer}
                    handleAnswerInputKeyUp={this.handleAnswerInputKeyUp}
                    handleInputNote={this.handleInputNote}
                  />
                </div>
              );
          }
        })()}
        <div>
          {
            <Button
              id="add-card-button"
              onClick={this.handleAddCard /*this.handleInputReset.bind(this)*/}
            >
              Add Card
            </Button>
          }
        </div>
      </div>
    );
  }
}

export default AddCard;
