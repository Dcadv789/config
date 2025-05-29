import React from 'react';
import { Layers, LayoutDashboard } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <aside className={`fixed w-60 top-6 bottom-6 rounded-2xl flex flex-col z-10 transition-colors duration-200
      ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Logo area */}
      <div className={`p-6 flex items-center justify-center gap-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <Layers size={28} className="text-indigo-500" />
        <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>AppLogo</span>
      </div>

      {/* Navigation menu */}
      <nav className="flex-grow p-4">
        <div className="px-2">
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-500/10 
            ${isDark ? 'text-indigo-400' : 'text-indigo-600'} font-medium`}>
            <LayoutDashboard size={20} />
            Dashboard
          </button>
        </div>
      </nav>

      {/* Theme toggle and footer */}
      <div className="px-4 pb-4">
        <div className="flex flex-col items-center gap-4">
          <div className={`w-full flex items-center justify-center gap-3 pb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <ThemeToggle />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {isDark ? 'Modo Escuro' : 'Modo Claro'}
            </span>
          </div>
          <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2025 Axory
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;