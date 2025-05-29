import React, { useState } from 'react';
import { Bell, Search, User, ChevronDown, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Topbar: React.FC = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className={`rounded-2xl px-6 flex items-center justify-between h-16 transition-colors duration-200
      ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Left section - Search */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
        </div>
        <input
          type="text"
          className={`w-full py-2 pl-10 pr-4 text-sm border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500
            ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
          placeholder="Buscar..."
        />
      </div>

      {/* Right section - User actions */}
      <div className="flex items-center space-x-4">
        <button className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Bell className="h-5 w-5" />
        </button>

        <div className="relative">
          <button
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors
              ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            onClick={toggleProfileMenu}
          >
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
            <div className="hidden md:block text-left">
              <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Usuário</div>
              <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Administrador</div>
            </div>
            <ChevronDown className={`h-4 w-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>

          {isProfileMenuOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-lg py-1 z-50 border
              ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Conectado como</p>
                <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  usuario@exemplo.com
                </p>
              </div>
              <button className={`flex w-full items-center px-4 py-2 text-sm
                ${isDark ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </button>
              <button className={`flex w-full items-center px-4 py-2 text-sm
                ${isDark ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar