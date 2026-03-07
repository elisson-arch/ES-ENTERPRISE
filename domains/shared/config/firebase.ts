
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { APP_CONFIG } from "./config";

const getFirebaseApp = () => {
    const firebaseConfig = {
        apiKey: APP_CONFIG.FIREBASE.API_KEY,
        authDomain: APP_CONFIG.FIREBASE.AUTH_DOMAIN,
        projectId: APP_CONFIG.FIREBASE.PROJECT_ID,
        storageBucket: APP_CONFIG.FIREBASE.STORAGE_BUCKET,
        messagingSenderId: APP_CONFIG.FIREBASE.MESSAGING_SENDER_ID,
        appId: APP_CONFIG.FIREBASE.APP_ID
    };
    return !getApps().length ? initializeApp(firebaseConfig) : getApp();
};

/**
 * Inicialização do Firebase:
 * As chaves podem vir do backend (Secret Manager) via loadSecureConfig().
 */
export const getDb = () => getFirestore(getFirebaseApp());

// Referências exportadas para compatibilidade
export const db = getDb();
export const auth = getAuth(getFirebaseApp());
