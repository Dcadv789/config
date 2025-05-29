import React from 'react';
import { Home, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface NavigationProps {
  collapsed: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ collapsed }) => {
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
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-lg transition-colors duration-200
              ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Icon size={22} />
            {!collapsed && label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;