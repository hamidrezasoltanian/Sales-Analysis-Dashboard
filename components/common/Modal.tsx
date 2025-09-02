import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    size?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = '2xl' }) => {
    if (!isOpen) return null;
    
    const sizeClasses = {
        'md': 'md:max-w-md',
        'lg': 'md:max-w-lg',
        'xl': 'md:max-w-xl',
        '2xl': 'md:max-w-2xl',
        '3xl': 'md:max-w-3xl',
        '4xl': 'md:max-w-4xl',
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className={`w-11/12 ${sizeClasses[size]} rounded-2xl shadow-2xl p-6 card transform transition-all duration-300 scale-95 opacity-0 animate-fade-scale-in`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;