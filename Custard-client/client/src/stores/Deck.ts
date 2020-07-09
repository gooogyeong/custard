import { observable, action, autorun } from "mobx";
import moment from "moment";
import { DeckRef, CardRef, getDeckRef, getCardRef } from "../firebase";
import { Deck, Card, CardForm, CardType } from "../types";
import { client } from "../google_cloud";

export class DeckStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    autorun(() => {
      this.uuid = this.rootStore.userStore.uuid;
    });
    this.setCurrDeck = this.setCurrDeck.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.editCardType = this.editCardType.bind(this);
    this.editQuestion = this.editQuestion.bind(this);
    this.editAnswer = this.editAnswer.bind(this);
    this.editHint = this.editHint.bind(this);
    this.handleCorrect = this.handleCorrect.bind(this);
    this.handleWrong = this.handleWrong.bind(this);
  }
  rootStore;

  uuid: string = null;
  @observable errMsg: string = null;
  @observable userDecks: Deck[] = null;
  @observable currDeck: Deck = null;
  @observable currStudyCover: number = 0;
  @observable currStudyCorrect: number = 0;
  @observable currStudyWrong: number = 0;
  //@observable currDeckCards: Card[] = null;

  @action
  getUserDecks(uuid: string) {
    DeckRef.orderByChild("uuid")
      .equalTo(uuid)
      .on(
        "value",
        function (snap) {
          if (snap.exists()) {
            this.setUserDecks(snap);
          } else {
            this.errMsg = "no decks for user";
          }
        }.bind(this)
      );
  }

  @action
  setUserDecks(snap) {
    const userDecksArr = [];
    Object.keys(snap.val()).forEach((key) => {
      const deckSnapshot = snap.val()[key];
      const userDeck = <Deck>{};
      userDeck.authorId = deckSnapshot["author_id"];
      userDeck.createdAt = deckSnapshot["created_at"];
      userDeck.key = deckSnapshot["key"];
      userDeck.lastUpdatedAt = deckSnapshot["last_updated_at"];
      userDeck.title = deckSnapshot["title"];
      userDeck.uuid = deckSnapshot["uuid"];
      //userDeck.cards = deckSnapshot["cards"] || [];
      userDeck.subDecks = deckSnapshot["sub_decks"] || [];
      userDeck.superDecks = deckSnapshot["super_decks"] || [];
      userDecksArr.push(userDeck);
    });
    this.userDecks = userDecksArr;
  }

  createNewDeck() {
    const newDeckPath = DeckRef.push().key;
    const initialDeckRef = getDeckRef(newDeckPath);
    initialDeckRef.set({
      key: newDeckPath,
      uuid: this.uuid,
      author_id: this.uuid,
      title: "customize new deck",
      created_at: moment().format("YYYY.MM.DD HH:mm"),
      last_updated_at: moment().format("YYYY.MM.DD HH:mm"),
      cards: [],
      subDecks: [],
      superDecks: [],
    });
  }

  editDeckTitle(deckKey: string, newDeckTitle: string) {
    const deckPath = deckKey;
    getDeckRef(deckPath).update({
      title: newDeckTitle,
    });
  }

  @action
  setCurrDeck(deckKey: string) {
    this.currDeck = this.userDecks
      ? this.userDecks.filter((deck) => deck.key === deckKey)[0]
      : null;
  }

  createNewCards(deckKey: string, validAddCardForm: any[] /*CardForm[]*/) {
    //TODO: answer에 있는 보기 싫은 {{ }} .replace()로 없애줘야!? -> study부분에서 해결해야할 문제
    /*{ answer: "apple"
cardType: "flashcard"
deckKey: "-MBKCYRzcJpxRReQ98Yy"
note: "snow white"
question: "사과"}*/
    const promises = validAddCardForm.map((cardForm, i) => {
      const newCardPath = CardRef.child(deckKey).push().key;
      const newCardRef = getCardRef(deckKey).child(newCardPath);
      console.log(deckKey);
      const newCard = {
        deck_key: deckKey,
        card_type: cardForm.cardType,
        question: cardForm.question,
        answer: cardForm.answer,
        answer_target: cardForm.answerTarget || [],
        hint: cardForm.note || "",
        created_at: moment().format("YYYY.MM.DD HH:mm"),
        last_studied_at: "null",
        cover_count: 0,
        correct_count: 0,
        wrong_count: 0,
        marked: "false",
      };
      newCardRef.set(newCard);
    });
    Promise.all(promises);
  }

  detectText() {
    //client;
  }

  deleteCard(cardKey: string) {
    const cardRef = getCardRef(this.currDeck.key).child(cardKey);
    cardRef.remove();
  }

  editCardType(cardKey: string, newCardType: CardType) {
    const cardRef = getCardRef(this.currDeck.key).child(cardKey);
    cardRef.update({
      card_type: newCardType,
    });
  }

  editQuestion(cardKey: string, newQuestion: string) {
    const cardRef = getCardRef(this.currDeck.key).child(cardKey);
    cardRef.update({
      question: newQuestion,
    });
  }

  editAnswer(cardKey: string, newAnswer: string) {
    const cardRef = getCardRef(this.currDeck.key).child(cardKey);
    cardRef.update({
      answer: newAnswer,
    });
  }

  editHint(cardKey: string, newHint: string) {
    const cardRef = getCardRef(this.currDeck.key).child(cardKey);
    cardRef.update({
      answer: newHint,
    });
  }

  @action
  handleCorrect() {
    this.currStudyCover++;
    this.currStudyCorrect++;
  }

  @action
  handleWrong() {
    this.currStudyCover++;
    this.currStudyWrong++;
  }
}
