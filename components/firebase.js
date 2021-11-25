// import * as firebase from "firebase";
// import * as firebase from "firebase/app";
import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyC3zeeazuRoCN02oGf36ILege3uV1YdSjk",
  authDomain: "mefisio.firebaseapp.com",
  projectId: "mefisio",
  storageBucket: "mefisio.appspot.com",
  messagingSenderId: "688120549570",
  appId: "1:688120549570:web:077512c03b522ac0ec6b5b",
  measurementId: "G-06KWHJLP78",
};
// if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
// }

export default firebase;
