//import { createContext } from "react";
import { UserStore } from "./User";
import { DeckStore } from "./Deck";
import { CardStore } from "./Card";

export class RootStore {
  constructor() {
    this.userStore = new UserStore(this);
    this.deckStore = new DeckStore(this);
    this.cardStore = new CardStore(this);
  }
  userStore;
  deckStore;
  cardStore;
}

export const rootStore = new RootStore();
