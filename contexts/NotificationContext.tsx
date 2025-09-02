
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Notification from '../components/common/Notification.tsx';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
    message: string;
    type: NotificationType;
    visible: boolean;
}

interface NotificationContextType {
    showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationState>({ message: '', type: 'info', visible: false });

    const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
        setNotification({ message, type, visible: true });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(prev => ({ ...prev, visible: false }));
    }, []);

    const portalElement = document.getElementById('notification-portal');
    if (!portalElement) {
        console.error("Notification portal not found in the DOM.");
        return <>{children}</>;
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {ReactDOM.createPortal(
                <Notification
                    message={notification.message}
                    type={notification.type}
                    visible={notification.visible}
                    onClose={hideNotification}
                />,
                portalElement
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};