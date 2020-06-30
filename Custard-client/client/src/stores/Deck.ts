import { observable, action } from "mobx";
import firebase from "firebase/app";
import { DeckRef } from "../firebase";
import { Deck } from "../types";

export class DeckStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }
  rootStore;

  @observable errMsg: string = null;
  @observable userDecks: Deck[] = null;

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
    console.log(snap.val());
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
      userDeck.cards = deckSnapshot["cards"] || [];
      userDeck.subDecks = deckSnapshot["sub_decks"] || [];
      userDeck.superDecks = deckSnapshot["super_decks"] || [];
      userDecksArr.push(userDeck);
    });
    this.userDecks = userDecksArr;
  }
}
