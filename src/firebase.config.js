import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDS23itKGE9034pl8xf5qzwNl4Axqo6cxA",
  authDomain: "house-marketplace-app-fb970.firebaseapp.com",
  projectId: "house-marketplace-app-fb970",
  storageBucket: "house-marketplace-app-fb970.appspot.com",
  messagingSenderId: "511418674839",
  appId: "1:511418674839:web:fc6f35aef44bea915d43d2",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize storage
getStorage();
export const db = getFirestore();
