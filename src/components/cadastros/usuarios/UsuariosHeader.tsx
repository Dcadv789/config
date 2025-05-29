import React from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface UsuariosHeaderProps {
  onNewUser: () => void;
}

const UsuariosHeader: React.FC<UsuariosHeaderProps> = ({ onNewUser }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Usuários do Sistema
        </h2>
        <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Gerencie os usuários que têm acesso ao sistema
        </p>
      </div>
      <button
        onClick={onNewUser}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
      >
        <Plus className="h-5 w-5" />
        Novo Usuário
      </button>
    </div>
  );
};

export default UsuariosHeader;