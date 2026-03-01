
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    DocumentData,
    QueryConstraint
} from "firebase/firestore";
import { db } from "@shared/config/firebase";

export const firestoreService = {
    /**
     * Obtém todos os documentos de uma coleção
     */
    async getAll<T>(collectionName: string): Promise<T[]> {
        const colRef = collection(db, collectionName);
        const snapshot = await getDocs(colRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    },

    /**
     * Obtém um documento por ID
     */
    async getById<T>(collectionName: string, id: string): Promise<T | null> {
        const docRef = doc(db, collectionName, id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data() } as T;
        }
        return null;
    },

    /**
     * Adiciona um novo documento
     */
    async add<T extends DocumentData>(collectionName: string, data: T): Promise<string> {
        const colRef = collection(db, collectionName);
        const docRef = await addDoc(colRef, data);
        return docRef.id;
    },

    /**
     * Atualiza um documento existente
     */
    async update<T extends DocumentData>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data as any);
    },

    /**
     * Exclui um documento
     */
    async delete(collectionName: string, id: string): Promise<void> {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
    },

    /**
     * Consulta documentos com filtros
     */
    async query<T>(collectionName: string, ...constraints: QueryConstraint[]): Promise<T[]> {
        const colRef = collection(db, collectionName);
        const q = query(colRef, ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    },

    /**
     * Listener em tempo real para uma coleção ou consulta
     */
    subscribe<T>(
        collectionName: string,
        callback: (data: T[]) => void,
        ...constraints: QueryConstraint[]
    ) {
        const colRef = collection(db, collectionName);
        const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;

        return onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
            callback(data);
        });
    }
};
