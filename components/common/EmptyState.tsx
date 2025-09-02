
import React from 'react';

interface EmptyStateProps {
    message: string;
    icon?: React.ReactNode;
    actionButton?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon, actionButton }) => {
    return (
        <div className="text-center p-8 text-secondary border-2 border-dashed rounded-lg flex flex-col items-center justify-center min-h-[200px]" style={{borderColor: 'var(--border-color)'}}>
            {icon && <div className="mx-auto mb-4 w-12 h-12">{icon}</div>}
            <p>{message}</p>
            {actionButton && <div className="mt-4">{actionButton}</div>}
        </div>
    );
};

export default EmptyState;