import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center w-14 h-7 rounded-full relative transition-colors duration-200
        ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
    >
      <div
        className={`absolute w-6 h-6 rounded-full transition-transform duration-200 flex items-center justify-center
          ${theme === 'dark' ? 'translate-x-[30%] bg-indigo-500' : '-translate-x-[30%] bg-white'}`}
      >
        {theme === 'dark' ? (
          <Moon size={14} className="text-white" />
        ) : (
          <Sun size={14} className="text-gray-700" />
        )}
      </div>
    </button>
  );
}

export default ThemeToggle