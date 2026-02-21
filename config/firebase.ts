
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { APP_CONFIG } from "./config";

const firebaseConfig = {
    apiKey: APP_CONFIG.FIREBASE.API_KEY,
    authDomain: APP_CONFIG.FIREBASE.AUTH_DOMAIN,
    projectId: APP_CONFIG.FIREBASE.PROJECT_ID,
    storageBucket: APP_CONFIG.FIREBASE.STORAGE_BUCKET,
    messagingSenderId: APP_CONFIG.FIREBASE.MESSAGING_SENDER_ID,
    appId: APP_CONFIG.FIREBASE.APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
