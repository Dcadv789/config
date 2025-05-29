import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import TabBar from '../components/common/TabBar';
import EmpresaFilter from '../components/common/EmpresaFilter';

type Tab = 'usuarios' | 'empresas' | 'clientes' | 'pessoas';

const Cadastros: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<Tab>('usuarios');
  const [selectedEmpresa, setSelectedEmpresa] = useState('');

  const tabs = [
    { id: 'usuarios', label: 'Usuários' },
    { id: 'empresas', label: 'Empresas' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'pessoas', label: 'Pessoas' },
  ];

  return (
    <div className="h-full">
      <div className="px-6 mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Cadastros
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Gerencie todos os cadastros do sistema em um único lugar
        </p>
      </div>

      <div className={`px-6 ${isDark ? 'bg-[#151515]' : 'bg-white'} py-4 rounded-xl`}>
        <div className="flex items-center gap-8">
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as Tab)}
            className="flex-1"
          />
          <EmpresaFilter
            value={selectedEmpresa}
            onChange={setSelectedEmpresa}
          />
        </div>
      </div>
    </div>
  );
};

export default Cadastros;