
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3xzxLqlatmHj488c0i_l1HQI_7CjawH8",
  authDomain: "otobotlar-arsivi.firebaseapp.com",
  projectId: "otobotlar-arsivi",
  storageBucket: "otobotlar-arsivi.appspot.com",
  messagingSenderId: "731429502087",
  appId: "1:731429502087:web:7863cd8b6e79dfa8f88c22",
  measurementId: "G-ED6YGHT04R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc };
