import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { APP_CONFIG } from "./config";

const getFirebaseApp = (): FirebaseApp | null => {
    const firebaseConfig = {
        apiKey: APP_CONFIG.FIREBASE.API_KEY,
        authDomain: APP_CONFIG.FIREBASE.AUTH_DOMAIN,
        projectId: APP_CONFIG.FIREBASE.PROJECT_ID,
        storageBucket: APP_CONFIG.FIREBASE.STORAGE_BUCKET,
        messagingSenderId: APP_CONFIG.FIREBASE.MESSAGING_SENDER_ID,
        appId: APP_CONFIG.FIREBASE.APP_ID
    };

    if (!firebaseConfig.apiKey) {
        console.warn("[FIREBASE] API Key not found. Firebase will not be initialized natively right now. Waiting for Secure Loader.");
        return null;
    }

    try {
        return !getApps().length ? initializeApp(firebaseConfig) : getApp();
    } catch (e) {
        console.error("[FIREBASE] Failed to initialize App:", e);
        return null;
    }
};

/**
 * Inicialização do Firebase:
 * Agora carregando diretamente via VITE_FIREBASE_* configurado via envDir no Vite.
 */
const app = getFirebaseApp();

export const db: Firestore = app ? getFirestore(app) : (null as unknown as Firestore);
export const auth: Auth = app ? getAuth(app) : (null as unknown as Auth);
