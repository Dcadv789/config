import React from 'react';
import { Plus, Link } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface CategoriasHeaderProps {
  onNewGrupo: () => void;
  onNewCategoria: () => void;
  onVincularMassa: () => void;
}

const CategoriasHeader: React.FC<CategoriasHeaderProps> = ({
  onNewGrupo,
  onNewCategoria,
  onVincularMassa
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Categorias
        </h2>
        <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Gerencie as categorias para classificação de indicadores e métricas
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onVincularMassa}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Link className="h-5 w-5" />
          Vincular em Massa
        </button>
        <button
          onClick={onNewCategoria}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Nova Categoria
        </button>
        <button
          onClick={onNewGrupo}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Novo Grupo
        </button>
      </div>
    </div>
  );
};

export default CategoriasHeader;