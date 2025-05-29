import React from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface CategoriasFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  tipoFilter: 'receitas' | 'despesas' | 'todas';
  onTipoChange: (tipo: 'receitas' | 'despesas' | 'todas') => void;
  statusFilter: 'ativas' | 'inativas' | 'todas';
  onStatusChange: (status: 'ativas' | 'inativas' | 'todas') => void;
}

const CategoriasFilter: React.FC<CategoriasFilterProps> = ({
  searchTerm,
  onSearchChange,
  tipoFilter,
  onTipoChange,
  statusFilter,
  onStatusChange
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const buttonClass = (current: string, value: string) => `
    px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200
    ${current === value
      ? isDark
        ? 'bg-indigo-600 text-white'
        : 'bg-indigo-500 text-white'
      : isDark
        ? 'text-gray-300 hover:bg-gray-700'
        : 'text-gray-600 hover:bg-gray-100'
    }
  `;

  return (
    <div className={`rounded-lg mb-6 ${isDark ? 'bg-[#151515]' : 'bg-white'}`}>
      <div className="flex items-center gap-4 p-4">
        <div className="flex-1">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <Search className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Buscar por código ou nome..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full bg-transparent border-none focus:ring-0 ${isDark ? 'text-white placeholder:text-gray-400' : 'text-gray-900 placeholder:text-gray-500'}`}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTipoChange('receitas')}
            className={buttonClass(tipoFilter, 'receitas')}
          >
            Receitas
          </button>
          <button
            onClick={() => onTipoChange('despesas')}
            className={buttonClass(tipoFilter, 'despesas')}
          >
            Despesas
          </button>
          <button
            onClick={() => onTipoChange('todas')}
            className={buttonClass(tipoFilter, 'todas')}
          >
            Todas
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onStatusChange('ativas')}
            className={buttonClass(statusFilter, 'ativas')}
          >
            Ativas
          </button>
          <button
            onClick={() => onStatusChange('inativas')}
            className={buttonClass(statusFilter, 'inativas')}
          >
            Inativas
          </button>
          <button
            onClick={() => onStatusChange('todas')}
            className={buttonClass(statusFilter, 'todas')}
          >
            Todas
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriasFilter;