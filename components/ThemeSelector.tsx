
import React from 'react';
import { Theme } from '../types';

interface ThemeSelectorProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, setTheme }) => {
    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(e.target.value as Theme);
    };

    return (
        <div className="max-w-xs">
            <label htmlFor="themeSelect" className="block text-sm font-medium mb-2">
                انتخاب تم برنامه
            </label>
            <select
                id="themeSelect"
                value={theme}
                onChange={handleThemeChange}
                className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700 shadow"
                title="تغییر تم"
            >
                <option value={Theme.Default}>روشن (پیش‌فرض)</option>
                <option value={Theme.Gray}>تاریک</option>
                <option value={Theme.Blue}>آبی</option>
            </select>
        </div>
    );
};

export default ThemeSelector;
