import firebase from "firebase/app";
import "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClIakPq5RDEb4NOIjE5Id4D44JAeveBr4",
  authDomain: "teasy-1571463510829.firebaseapp.com",
  databaseURL: "https://teasy-1571463510829.firebaseio.com",
  projectId: "teasy-1571463510829",
  storageBucket: "teasy-1571463510829.appspot.com",
  messagingSenderId: "224551668607",
  appId: "1:224551668607:web:3d5dcf7d368e7ef2fbe84a",
  measurementId: "G-7C8JJ063XL"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { firebase, storage as default };