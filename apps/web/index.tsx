import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from '@shared/views/App';
import { AppProvider } from '@shared/hooks/useAppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ---------------------------------------------------------------------------
// Sentry — monitoramento de erros em produção
// ---------------------------------------------------------------------------
Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE, // 'development' | 'production'
    enabled: import.meta.env.PROD,    // Apenas ativo em produção
    tracesSampleRate: 0.2,            // 20% das transações para performance
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos de cache
            retry: 1,
        },
    },
});

class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error?: Error }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }
    componentDidCatch(error: Error, info: React.ErrorInfo) {
        Sentry.captureException(error, {
            contexts: { react: { componentStack: info.componentStack } },
        });
        console.error('[ErrorBoundary] Erro fatal de renderização:', error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-5 bg-red-50 text-red-800 font-sans">
                    <h2>Erro Fatal de Renderização do React</h2>
                    <pre className="whitespace-pre-wrap">{this.state.error?.toString()}</pre>
                    <pre className="whitespace-pre-wrap text-[11px]">{this.state.error?.stack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Could not find root element to mount to');

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <GlobalErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <AppProvider>
                    <App />
                </AppProvider>
            </QueryClientProvider>
        </GlobalErrorBoundary>
    </React.StrictMode>
);
