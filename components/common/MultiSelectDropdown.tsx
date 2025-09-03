import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectDropdownProps {
    options: { value: string; label: string }[];
    selectedValues: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    options,
    selectedValues,
    onChange,
    placeholder = 'انتخاب کنید...'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (value: string) => {
        const newSelectedValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
        onChange(newSelectedValues);
    };

    const getButtonLabel = () => {
        if (selectedValues.length === 0) {
            return placeholder;
        }
        if (selectedValues.length === 1) {
            return options.find(opt => opt.value === selectedValues[0])?.label || placeholder;
        }
        return `${selectedValues.length.toLocaleString('fa-IR')} مورد انتخاب شده`;
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700 text-right flex justify-between items-center h-[42px]"
            >
                <span className="truncate">{getButtonLabel()}</span>
                <svg
                    className={`h-5 w-5 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto" style={{backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)'}}>
                    <ul className="p-1">
                        {options.map((option) => (
                            <li
                                key={option.value}
                                className="p-2 rounded-md hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm"
                                style={{backgroundColor: selectedValues.includes(option.value) ? 'var(--sidebar-active-bg)' : 'transparent'}}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(option.value);
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedValues.includes(option.value)}
                                    readOnly
                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-[var(--button-bg)]"
                                />
                                <span className="flex-grow">{option.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
