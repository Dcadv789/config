import React, { useState } from 'react';
import Logo from './sidebar/Logo';
import DateTime from './sidebar/DateTime';
import Navigation from './sidebar/Navigation';
import Footer from './sidebar/Footer';
import { useTheme } from '../../context/ThemeContext';

const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  return (
    <aside className={`fixed w-60 top-6 bottom-6 rounded-2xl flex flex-col z-10 transition-colors duration-200
      ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <Logo />
      <DateTime />
      <Navigation selectedMenu={selectedMenu} onMenuSelect={setSelectedMenu} />
      <Footer />
    </aside>
  );
};

export default Sidebar;