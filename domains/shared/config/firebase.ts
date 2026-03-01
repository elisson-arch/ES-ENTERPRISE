
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { APP_CONFIG } from "./config";

/**
 * Inicialização do Firebase: 
 * Como as chaves agora podem vir do backend (Secret Manager),
 * garantimos que o Firestore use as chaves mais recentes do APP_CONFIG.
 */
export const getDb = () => {
    const firebaseConfig = {
        apiKey: APP_CONFIG.FIREBASE.API_KEY,
        authDomain: APP_CONFIG.FIREBASE.AUTH_DOMAIN,
        projectId: APP_CONFIG.FIREBASE.PROJECT_ID,
        storageBucket: APP_CONFIG.FIREBASE.STORAGE_BUCKET,
        messagingSenderId: APP_CONFIG.FIREBASE.MESSAGING_SENDER_ID,
        appId: APP_CONFIG.FIREBASE.APP_ID
    };

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    return getFirestore(app);
};

// Exportamos uma referência para compatibilidade, mas idealmente serviços devem usar getDb()
export const db = getDb();
