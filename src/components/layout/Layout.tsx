import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useTheme } from '../../context/ThemeContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex justify-center ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
      <div className="max-w-[1920px] w-full px-6">
        <div className="flex relative pt-4">
          <Sidebar />
          
          <div className="flex-grow ml-72">
            <Topbar />
            
            <main className={`mt-4 rounded-2xl min-h-[calc(100vh-100px)] p-6 
              ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;