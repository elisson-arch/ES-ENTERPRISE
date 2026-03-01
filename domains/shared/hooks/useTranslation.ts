import { useState, useEffect } from 'react';
import { translationService } from '../services/translationService';
import { Message } from '../types';

export const useTranslation = () => {
    const [isAutoTranslateEnabled, setIsAutoTranslateEnabled] = useState<boolean>(() => {
        return localStorage.getItem('es_auto_translate') === 'true';
    });

    const toggleAutoTranslate = (enabled: boolean) => {
        setIsAutoTranslateEnabled(enabled);
        localStorage.setItem('es_auto_translate', enabled.toString());
    };

    const translateMessage = async (msg: Message): Promise<string> => {
        if (!isAutoTranslateEnabled) return msg.text;

        // Simple heuristic: if text has many non-PT characters or we just attempt translation
        // In a real app, we might check a 'translatedText' cache on the message object
        return await translationService.translateToPTBR(msg.text);
    };

    return {
        isAutoTranslateEnabled,
        toggleAutoTranslate,
        translateMessage
    };
};
