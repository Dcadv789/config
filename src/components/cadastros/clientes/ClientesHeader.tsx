import React from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ClientesHeaderProps {
  onNewCliente: () => void;
  empresaId: string | null;
}

const ClientesHeader: React.FC<ClientesHeaderProps> = ({ onNewCliente, empresaId }) => {
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
          disabled={!empresaId}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2
            ${!empresaId 
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          title={!empresaId ? 'Selecione uma empresa para cadastrar um novo cliente' : ''}
        >
          <Plus className="h-5 w-5" />
          Novo Cliente
        </button>
      </div>
    </div>
  );
};

export default ClientesHeader;