
/**
 * Interface para a configuração da aplicação
 */
export interface AppConfig {
    METADATA: {
        NAME: string;
        DESCRIPTION: string;
        VERSION: string;
        REGION: string;
    };
    GOOGLE: {
        CLIENT_ID: string;
        SCOPES: string[];
    };
    AI: {
        PROVIDER: string;
        MODELS: {
            PRIMARY: string;
            FAST: string;
            IMAGE: string;
            IMAGE_EDIT: string;
        };
        SYSTEM_INSTRUCTIONS: {
            RICARDO_IA: string;
        };
    };
    API: {
        AI_GENERATE_PROXY: string;
        GSI_CLIENT_URL: string;
    };
    FIREBASE: {
        API_KEY: string;
        AUTH_DOMAIN: string;
        PROJECT_ID: string;
        STORAGE_BUCKET: string;
        MESSAGING_SENDER_ID: string;
        APP_ID: string;
    };
}

/**
 * Configurações Estáticas e Padronizadas
 */
const BASE_CONFIG: AppConfig = {
    METADATA: {
        NAME: "ES Enterprise",
        DESCRIPTION: "CRM Inteligente para Climatização",
        VERSION: "2.6.0",
        REGION: "us-central1"
    },
    GOOGLE: {
        CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
        SCOPES: [
            'openid',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/contacts',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/documents',
            'https://www.googleapis.com/auth/tasks'
        ]
    },
    AI: {
        PROVIDER: import.meta.env.VITE_AI_PROVIDER || 'gemini',
        MODELS: {
            PRIMARY: 'gemini-3-pro-preview',
            FAST: 'gemini-3-flash-preview',
            IMAGE: 'gemini-3-pro-image-preview',
            IMAGE_EDIT: 'gemini-2.5-flash-image'
        },
        SYSTEM_INSTRUCTIONS: {
            RICARDO_IA: `Você é o Ricardo IA, o Engenheiro Chefe da ES Enterprise. 
Sua especialidade absoluta é Climatização, Refrigeração (HVAC) e Gestão de Manutenção Industrial/Residencial.
Ao responder:
1. Use terminologia técnica precisa (BTUs, Compressor, Inverter, PMOC, Válvula de Expansão).
2. Priorize diagnósticos baseados em eficiência energética e durabilidade do equipamento.
3. Seja proativo sugerindo manutenções preventivas baseadas nos sintomas relatados.
4. Mantenha um tom profissional, ágil e focado em soluções práticas de campo.`
        }
    },
    API: {
        AI_GENERATE_PROXY: '/api/ai/generate',
        GSI_CLIENT_URL: 'https://accounts.google.com/gsi/client'
    },
    FIREBASE: {
        API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || "",
        AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
        PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
        STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
        MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
        APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || ""
    }
};

export const APP_CONFIG: AppConfig = BASE_CONFIG;
