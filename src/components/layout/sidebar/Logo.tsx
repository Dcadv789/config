import React from 'react';
import { Layers } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const Logo: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`p-6 flex items-center justify-center gap-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <Layers size={28} className="text-indigo-500" />
      <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>AppLogo</span>
    </div>
  );
};

export default Logo;