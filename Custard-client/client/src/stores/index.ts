//import { createContext } from "react";
import { UserStore } from "./User";

export class RootStore {
  constructor() {
    this.userStore = new UserStore(this);
  }
  userStore;
}

//export const rootStore = new RootStore();
