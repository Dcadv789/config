import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-center gap-6">
      <span className={`text-base font-medium transition-colors duration-200
        ${isDark ? 'text-gray-500' : 'text-blue-500'}`}>
        Light
      </span>
      
      <button
        onClick={toggleTheme}
        className={`flex items-center w-14 h-7 rounded-full relative transition-colors duration-200
          ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
      >
        <div
          className={`absolute w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center
            ${isDark 
              ? 'translate-x-[30px] bg-blue-500' 
              : 'translate-x-[2px] bg-white shadow-md'}`}
        >
          {isDark ? (
            <Moon size={14} className="text-white" />
          ) : (
            <Sun size={14} className="text-gray-700" />
          )}
        </div>
      </button>

      <span className={`text-base font-medium transition-colors duration-200
        ${isDark ? 'text-blue-500' : 'text-gray-500'}`}>
        Dark
      </span>
    </div>
  );
};

export default ThemeToggle;