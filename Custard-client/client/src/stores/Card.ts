import { observable, computed, action, autorun } from "mobx";
import { Deck, Card, CardForm, CardType, AnswerType } from "../types";
import { DeckRef, CardRef, getDeckRef, getCardRef } from "../firebase";
import { client } from "../google_cloud";

export class CardStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    autorun(() => {
      this.currDeck = this.rootStore.deckStore.currDeck;
    });
    /*autorun(() => {
      this.currStudyCover = this.rootStore.deckStore.currStudyCover;
      this.currStudyCorrect = this.rootStore.deckStore.currStudyCorrect;
      this.currStudyWrong = this.rootStore.deckStore.currStudyWrong;
    });*/
    autorun(() => {
      this.currDeckCardKeys = this.computeCurrDeckCardKeys;
    });
    this.setCurrStudyCard = this.setCurrStudyCard.bind(this);
    this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this);
    this.resetStudy = this.resetStudy.bind(this);
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
        //console.log("getting deck cards...");
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
  async handleAnswerSubmit(cardKey: string, answerType: AnswerType) {
    const cardRef = getCardRef(this.currDeck.key).child(cardKey);
    await cardRef.transaction(
      function (card) {
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
      }.bind(this)
    );
  }

  @action
  resetStudy() {
    this.currStudyCover = 0;
    this.currStudyCorrect = 0;
    this.currStudyWrong = 0;
  }

  // detectText(file) {
  //   client.labelDetection(file).then((res) => {
  //     const labels = res[0].labelAnnotations;
  //     labels
  //       .forEach((label) => console.log(label.description))
  //       .catch((err) => {
  //         console.error("ERROR: ", err);
  //       });
  //   });
  // }

  //   Make a call to the Vision API to detect text
  //   const results = await client.batchAnnotateImages({requests});
  //   const detections = results[0].responses;
  //   await Promise.all(
  //     inputFiles.map(async (filename, i) => {
  //       const response = detections[i];
  //       if (response.error) {
  //         console.info(`API Error for ${filename}`, response.error);
  //         return;
  //       }
  //       await extractDescriptions(filename, index, response);
  //     })
  //   );
  // }
}
