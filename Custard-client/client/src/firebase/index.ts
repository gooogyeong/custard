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

export const UserRef = database.ref(`User`);

//storage.ref() ?
const rootRef = storage.ref();
export const profileRef = storage.ref("Profile");
//export const profileImgRef = rootRef.child("Profile");

export const getUserRef = (userPath: string) => UserRef.child(userPath);

export const onSignInClick = firebase
  .functions()
  .httpsCallable("onSignInClick");

// Your web app's Firebase configuration
//   var firebaseConfig = {
//     apiKey: "AIzaSyBXeZNycAS8aBbjhBW78X6631GiS9AXt1s",
//     authDomain: "custard-937a9.firebaseapp.com",
//     databaseURL: "https://custard-937a9.firebaseio.com",
//     projectId: "custard-937a9",
//     storageBucket: "custard-937a9.appspot.com",
//     messagingSenderId: "393719772719",
//     appId: "1:393719772719:web:43048ed2f0233bd6dbf8da"
//   };
// Initialize Firebase
