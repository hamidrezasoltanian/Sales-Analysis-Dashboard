import React, { useState, useEffect, useRef } from 'react';

interface InlineEditProps {
    value: string | number | null;
    onSave: (newValue: string) => void;
    placeholder?: string;
    isReadOnly?: boolean;
    formatter?: (val: any) => string;
}

const InlineEdit: React.FC<InlineEditProps> = ({ value, onSave, placeholder = '-', isReadOnly = false, formatter }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(String(value ?? ''));
    const inputRef = useRef<HTMLInputElement>(null);

    const displayValue = formatter ? formatter(value) : (String(value ?? placeholder));

    useEffect(() => {
        setCurrentValue(String(value ?? ''));
    }, [value]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (String(value ?? '') !== currentValue) {
            onSave(currentValue);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSave();
        else if (e.key === 'Escape') {
            setCurrentValue(String(value ?? ''));
            setIsEditing(false);
        }
    };

    if (isReadOnly) {
        return <div className="w-full p-1 text-center min-h-[34px] flex items-center justify-center">{displayValue}</div>;
    }

    if (isEditing) {
        return (
            <input
                ref={inputRef}
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-full p-1 border rounded-md text-center bg-gray-50 text-gray-700"
            />
        );
    }

    return (
        <div className="group flex items-center justify-center w-full p-1 min-h-[34px]">
            <span className="flex-grow text-center">{displayValue}</span>
            <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-blue-600 transition-opacity p-1 ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
            </button>
        </div>
    );
};

export default InlineEdit;
