
import { ptBR } from '../config/locales/pt-BR';

type Dictionary = typeof ptBR;

/**
 * Serviço simples de internacionalização.
 * Em um cenário real, usaria bibliotecas como i18next ou react-intl.
 */
export const t = (path: string, params?: Record<string, string>): string => {
    const keys = path.split('.');
    let result: any = ptBR;

    for (const key of keys) {
        if (result[key] === undefined) return path;
        result = result[key];
    }

    if (typeof result !== 'string') return path;

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            result = (result as string).replace(`{${key}}`, value);
        });
    }

    return result;
};
