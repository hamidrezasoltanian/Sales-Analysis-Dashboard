import React, { useEffect } from 'react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, visible, onClose }) => {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Auto-hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    const baseClasses = "fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-white transition-all duration-300 z-[100]";
    const typeClasses = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500"
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {message}
        </div>
    );
};

export default Notification;