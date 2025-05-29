import React from 'react';
import { Building, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface EmpresaFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const EmpresaFilter: React.FC<EmpresaFilterProps> = ({ value, onChange, className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`relative ${className}`}>
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
        ${isDark 
          ? 'bg-gray-700/50 hover:bg-gray-700/70' 
          : 'bg-gray-50 hover:bg-gray-100'}`}>
        <Building className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-transparent border-none focus:ring-0 text-sm font-medium appearance-none cursor-pointer pr-6
            ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
        >
          <option value="">Selecionar empresa</option>
          <option value="1">Empresa A</option>
          <option value="2">Empresa B</option>
          <option value="3">Empresa C</option>
        </select>
        <ChevronDown className={`h-4 w-4 absolute right-3 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    </div>
  );
};

export default EmpresaFilter;