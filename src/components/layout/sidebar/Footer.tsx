import React from 'react';
import ThemeToggle from '../ThemeToggle';
import { useTheme } from '../../../context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="px-4 pb-4">
      <div className="flex flex-col items-center gap-4">
        <div className={`w-full flex items-center justify-center pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <ThemeToggle />
        </div>
        <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          © 2025 Axory
        </div>
      </div>
    </div>
  );
};

export default Footer;