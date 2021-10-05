import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";

const config = {
  apiKey: "AIzaSyCrSwBh_zYVxTkVVKwWtoLNxFt7U0I1Hs0",
  authDomain: "denticare-60138.firebaseapp.com",
  databaseURL: "https://denticare-60138.firebaseio.com",
  projectId: "denticare-60138",
  storageBucket: "denticare-60138.appspot.com",
  messagingSenderId: "364098551893",
  appId: "1:364098551893:web:41cc3152615691c2f3d4dc",
  measurementId: "G-82WYSFXSE0"
};


if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const firebaseApp = firebase;
export const storage = firebase.storage();
export const db = firebase.firestore();
export const auth = firebase.auth();
export const database = firebase.database();
