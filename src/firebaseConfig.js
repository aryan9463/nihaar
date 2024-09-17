import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from '@react-native-firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyBkWLveBW4GF34Bkr5aj9r3cEcZfYwsIHU',
  authDomain: 'nihaar-app.firebaseapp.com',
  projectId: 'nihaar-app',
  storageBucket: 'nihaar-app.appspot.com',
  messagingSenderId: '455629437938',
  appId: '1:455629437938:web:eb4ed48e0166697cfe496b',
  measurementId: 'G-J3RN24PFSS',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = getFirestore();
export const datacollection = collection(db, 'dataCollection');

export default firebase