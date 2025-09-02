import React from 'react';

const PageLoader: React.FC = () => {
    return (
        <div className="flex justify-center items-center w-full h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4" style={{borderColor: 'var(--button-bg)'}}></div>
        </div>
    );
};

export default PageLoader;