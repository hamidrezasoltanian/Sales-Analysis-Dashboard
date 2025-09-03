import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    size?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const modalRoot = document.getElementById('modal-portal');

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = '2xl' }) => {
    if (!modalRoot) {
        console.error("Modal portal root element with id 'modal-portal' not found in the DOM.");
        return null;
    }

    if (!isOpen) return null;
    
    const sizeClasses = {
        'md': 'md:max-w-md',
        'lg': 'md:max-w-lg',
        'xl': 'md:max-w-xl',
        '2xl': 'md:max-w-2xl',
        '3xl': 'md:max-w-3xl',
        '4xl': 'md:max-w-4xl',
    };

    const modalContent = (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-start overflow-y-auto z-50 transition-opacity duration-300 pt-16 pb-8"
            onClick={onClose}
        >
            <div 
                className={`relative w-11/12 ${sizeClasses[size]} rounded-2xl shadow-2xl p-6 card transform transition-all duration-300 scale-95 opacity-0 animate-fade-scale-in`}
                onClick={(e) => e.stopPropagation()}
            >
                 <button
                    onClick={onClose}
                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition z-10"
                    aria-label="بستن"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );
    
    return ReactDOM.createPortal(modalContent, modalRoot);
};

export default Modal;