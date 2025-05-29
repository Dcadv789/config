import React from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ClientesHeaderProps {
  onNewCliente: () => void;
}

const ClientesHeader: React.FC<ClientesHeaderProps> = ({ onNewCliente }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Clientes Cadastrados
        </h2>
        <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Gerencie os clientes e seus dados cadastrais
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onNewCliente}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo Cliente
        </button>
      </div>
    </div>
  );
};

export default ClientesHeader;