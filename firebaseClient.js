import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBlGit5IJw8pau3UE3Xvrwx-CBZh9jbNeI",
  authDomain: "hovered-news.firebaseapp.com",
  projectId: "hovered-news",
  storageBucket: "hovered-news.appspot.com",
  messagingSenderId: "523413030696",
  appId: "1:523413030696:web:886b381c3b997faa12321d",
  measurementId: "G-T12XCP1JVW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();