import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@shared/views/App';
import { AppProvider } from '@shared/hooks/useAppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
        console.error("DIAGNOSTICO ROOT CATCH:", error, info);
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

console.log("DIAGNOSTICO: index.tsx executando...");

const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error("DIAGNOSTICO: rootElement não encontrado!");
    throw new Error('Could not find root element to mount to');
}

console.log("DIAGNOSTICO: Criando React Root...");
const root = ReactDOM.createRoot(rootElement);

console.log("DIAGNOSTICO: Renderizando aplicação...");
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
