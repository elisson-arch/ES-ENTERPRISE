import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification } from '@shared/types/common.types';

interface UserProfile {
    name: string;
    email: string;
    picture: string;
    organizationId?: string;
}

interface AppContextType {
    notifications: AppNotification[];
    unreadCount: number;
    addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
    markAsRead: (id: string) => void;
    clearAllNotifications: () => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (val: boolean) => void;
    user: UserProfile | null;
    loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Inicialização
        const profile = localStorage.getItem('sgc_profile');
        if (profile) {
            setUser(JSON.parse(profile));
            setIsAuthenticated(true);
        }
        setLoading(false);

        // Listener para mudanças de autenticação (disparado pelo googleApiService)
        const handleAuthChange = (e: CustomEvent<{ isAuthenticated: boolean; profile: UserProfile | null }>) => {
            const { isAuthenticated: authStatus, profile: userProfile } = e.detail;
            setIsAuthenticated(authStatus);
            setUser(userProfile);
        };

        window.addEventListener('google_auth_change', handleAuthChange as EventListener);
        return () => window.removeEventListener('google_auth_change', handleAuthChange as EventListener);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
        const newNotif: AppNotification = {
            ...notif,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            isRead: false,
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    return (
        <AppContext.Provider value={{
            notifications, unreadCount, addNotification, markAsRead, clearAllNotifications,
            isDarkMode, toggleTheme, isAuthenticated, setIsAuthenticated, user, loading
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within an AppProvider');
    return context;
};
