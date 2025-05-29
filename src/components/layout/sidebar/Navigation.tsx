import React from 'react';
import { Home, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface NavigationProps {
  selectedMenu: string;
  onMenuSelect: (menu: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ selectedMenu, onMenuSelect }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="flex-grow p-4">
      <div className="space-y-2">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button 
            key={id}
            onClick={() => onMenuSelect(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
              ${selectedMenu === id 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : `${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}`}>
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation