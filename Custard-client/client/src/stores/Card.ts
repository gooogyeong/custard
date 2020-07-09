import { observable, computed, action, autorun } from "mobx";
import { Deck, Card, CardForm, CardType, AnswerType } from "../types";
import { DeckRef, CardRef, getDeckRef, getCardRef } from "../firebase";

export class CardStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    autorun(() => {
      this.currDeck = this.rootStore.deckStore.currDeck;
      this.currStudyCover = this.rootStore.deckStore.currStudyCover;
      this.currStudyCorrect = this.rootStore.deckStore.currStudyCorrect;
      this.currStudyWrong = this.rootStore.deckStore.currStudyWrong;
    });
    autorun(() => {
      this.currDeckCardKeys = this.computeCurrDeckCardKeys;
    });
    this.setCurrStudyCard = this.setCurrStudyCard.bind(this);
    this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this);
  }
  rootStore;

  currDeckCardKeys: string[] = null;
  @observable currDeck: Deck = null;
  @observable errMsg: string = null;
  @observable currDeckCards: Card[] = null;
  @observable currStudyCard: Card = null;
  @observable currStudyCover: number = 0;
  @observable currStudyCorrect: number = 0;
  @observable currStudyWrong: number = 0;

  @computed
  get computeCurrDeckCardKeys() {
    return this.currDeckCards ? this.currDeckCards.map((card) => card.key) : [];
  }

  @action
  getDeckCards(deckKey: string) {
    getCardRef(deckKey).on(
      "value",
      function (snap) {
        console.log("getting deck cards...");
        if (snap.exists()) {
          this.setDeckCards(snap);
        } else {
          this.errMsg = "no card in this deck";
        }
      }.bind(this)
    );
  }

  @action
  setDeckCards(snap) {
    const deckCardsArr = [];
    Object.keys(snap.val()).forEach((key) => {
      const cardSnapshot = snap.val()[key];
      const deckCard = <Card>{};
      deckCard.key = key;
      deckCard.deckKey = cardSnapshot["deck_key"];
      deckCard.cardType = cardSnapshot["card_type"];
      deckCard.question = cardSnapshot["question"];
      deckCard.answer = cardSnapshot["answer"];
      deckCard.answerTarget = cardSnapshot["answer_target"];
      deckCard.hint = cardSnapshot["hint"];
      deckCard.createdAt = cardSnapshot["created_at"];
      deckCard.lastStudiedAt = cardSnapshot["last_studied_at"];
      deckCard.coverCount = cardSnapshot["cover_count"];
      deckCard.marked = cardSnapshot["marked"];
      deckCard.correctCount = cardSnapshot["correct_count"];
      deckCard.wrongCount = cardSnapshot["wrong_count"];
      deckCard.lastStudiedAt = cardSnapshot["last_studied_at"];
      deckCardsArr.push(deckCard);
    });
    this.currDeckCards = deckCardsArr;
  }

  @action
  setCurrStudyCard(cardKey: string) {
    if (this.currDeckCards) {
      this.currStudyCard = this.currDeckCards.filter(
        (card) => card.key === cardKey
      )[0];
    }
  }

  @action
  handleAnswerSubmit(cardKey: string, answerType: AnswerType) {
    const cardRef = getCardRef(this.currDeck.key).child(cardKey);
    cardRef.transaction(function (card) {
      if (card) {
        if (answerType === AnswerType.correct) {
          this.currStudyCorrect++;
          card["correct_count"]++;
        } else if (answerType === AnswerType.wrong) {
          this.currStudyWrong++;
          card["wrong_count"]++;
        }
        this.currStudyCover++;
        card["cover_count"]++;
      }
      return card;
    });
  }
}
