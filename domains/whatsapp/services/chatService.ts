
import { firestoreService } from './firestoreService';
import { ChatSession, Message } from '@shared/types/common.types';
import { collection, query, where, onSnapshot, orderBy, Timestamp, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@shared/config/firebase';

const CHATS_COLLECTION = 'chats';
const MESSAGES_COLLECTION = 'messages';

export const chatService = {
    // Obter todas as sessões de chat de uma organização
    subscribeToChats(orgId: string, callback: (chats: ChatSession[]) => void) {
        const q = query(
            collection(db, CHATS_COLLECTION),
            where('organizationId', '==', orgId),
            orderBy('updatedAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const chats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ChatSession[];
            callback(chats);
        });
    },

    // Obter mensagens de um chat específico em tempo real
    subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
        const q = query(
            collection(db, `${CHATS_COLLECTION}/${chatId}/${MESSAGES_COLLECTION}`),
            orderBy('timestamp', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Converter timestamp do Firestore para string legível se necessário
                    displayTime: data.timestamp instanceof Timestamp
                        ? data.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : data.timestamp
                };
            }) as Message[];
            callback(messages);
        });
    },

    // Enviar uma mensagem
    async sendMessage(chatId: string, message: Omit<Message, 'id'>) {
        const msgData = {
            ...message,
            timestamp: Timestamp.now()
        };

        // Adicionar a mensagem na sub-coleção
        const msgRef = await addDoc(collection(db, `${CHATS_COLLECTION}/${chatId}/${MESSAGES_COLLECTION}`), msgData);

        // Atualizar o "lastMessage" no chat principal para o dashboard/sidebar
        await updateDoc(doc(db, CHATS_COLLECTION, chatId), {
            lastMessage: message.text,
            updatedAt: new Date().toISOString()
        });

        return msgRef.id;
    },

    // Criar ou atualizar uma sessão de chat
    async upsertChat(chat: Partial<ChatSession> & { organizationId: string }) {
        if (chat.id) {
            await updateDoc(doc(db, CHATS_COLLECTION, chat.id), {
                ...chat,
                updatedAt: new Date().toISOString()
            });
            return chat.id;
        } else {
            const newChat = {
                ...chat,
                messages: [], // As mensagens ficam na sub-coleção
                updatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                unreadCount: chat.unreadCount || 0,
                aiEnabled: chat.aiEnabled || false
            };
            const docRef = await addDoc(collection(db, CHATS_COLLECTION), newChat);
            return docRef.id;
        }
    }
};
