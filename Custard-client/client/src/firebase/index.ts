//If you are using TypeScript with the npm package, you can import just the services you use:

// This import loads the firebase namespace along with all its type information.
import firebase from "firebase/app";
import { firebaseConfig } from "./config";

// These imports load individual services into the firebase namespace.
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
import "firebase/storage";
const app: firebase.app.App = firebase.initializeApp(firebaseConfig);
const database: firebase.database.Database = app.database();
const storage: firebase.storage.Storage = app.storage();
//export const auth: firebase.app.App = firebase.auth();

export const provider: firebase.auth.GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();
//const functions = firebase.functions();

//const custardPath = "custard-937a9";

export const UserRef = database.ref("User");
export const DeckRef = database.ref("Deck");
export const CardRef = database.ref("Card");

//storage.ref() ?
const rootRef = storage.ref();
export const profileRef = storage.ref("Profile");
//export const profileImgRef = rootRef.child("Profile");

export const getUserRef = (userPath: string) => UserRef.child(userPath);
export const getDeckRef = (deckPath: string) => DeckRef.child(deckPath);
export const getCardRef = (cardPath: string) => CardRef.child(cardPath);

export const onSignInClick = firebase
  .functions()
  .httpsCallable("onSignInClick");
