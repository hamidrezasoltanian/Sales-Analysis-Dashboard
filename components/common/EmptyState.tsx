import React from 'react';

interface EmptyStateProps {
    message: string;
    icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon }) => {
    return (
        <div className="text-center p-8 text-secondary border-2 border-dashed rounded-lg" style={{borderColor: 'var(--border-color)'}}>
            {icon && <div className="mx-auto mb-4 w-12 h-12">{icon}</div>}
            <p>{message}</p>
        </div>
    );
};

export default EmptyState;