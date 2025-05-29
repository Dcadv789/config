import React from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface PessoasHeaderProps {
  onNewPessoa: () => void;
  empresaId: string | null;
}

const PessoasHeader: React.FC<PessoasHeaderProps> = ({ onNewPessoa, empresaId }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Pessoas Cadastradas
        </h2>
        <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Gerencie vendedores, SDRs e suas atribuições
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onNewPessoa}
          disabled={!empresaId}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2
            ${!empresaId 
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-50' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          title={!empresaId ? 'Selecione uma empresa para cadastrar uma nova pessoa' : ''}
        >
          <Plus className="h-5 w-5" />
          Nova Pessoa
        </button>
      </div>
    </div>
  );
};

export default PessoasHeader;