//import { createContext } from "react";
import { UserStore } from "./User";
import { DeckStore } from "./Deck";

export class RootStore {
  constructor() {
    this.userStore = new UserStore(this);
    this.deckStore = new DeckStore(this);
  }
  userStore;
  deckStore;
}

export const rootStore = new RootStore();
