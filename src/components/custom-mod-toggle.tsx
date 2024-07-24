"use client"
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon } from "react-icons/fi";

export function CustomModeToggle() {
    const { theme, setTheme } = useTheme();
    const [isLight, setIsLight] = useState(true);

    useEffect(() => {
        setIsLight(theme !== 'dark');
    }, [theme]);

    const toggleTheme = () => {
        setTheme(isLight ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="w-14 h-7 rounded-full bg-gray-300 dark:bg-gray-600 relative transition-colors duration-300 focus:outline-none"
        >
            <div
                className={`w-5 h-5 rounded-full bg-white absolute top-1 flex items-center justify-center transition-transform duration-300 ${isLight ? 'left-1 translate-x-0' : 'left-1 translate-x-7'
                    }`}
            >
            </div>
            <span className="sr-only">Toggle theme</span>
            <FiSun className="absolute left-1.5 top-1.5 " size={14} />
            <FiMoon className={`absolute right-1.5 top-1.5 ${!isLight && 'text-black'}`} size={14} />
        </button>
    );
}