import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import TabBar from '../components/common/TabBar';
import EmpresaFilter from '../components/common/EmpresaFilter';
import CategoriasTab from '../components/banco-dados/categorias/CategoriasTab';

type Tab = 'categorias' | 'indicadores' | 'lancamentos' | 'lanc_clientes' | 'registro_vendas';

const BancoDados: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<Tab>('categorias');
  const [selectedEmpresa, setSelectedEmpresa] = useState('');

  const tabs = [
    { id: 'categorias', label: 'Categorias' },
    { id: 'indicadores', label: 'Indicadores' },
    { id: 'lancamentos', label: 'Lançamentos' },
    { id: 'lanc_clientes', label: 'Lanç. Clientes' },
    { id: 'registro_vendas', label: 'Registro de Vendas' },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'categorias':
        return <CategoriasTab empresaId={selectedEmpresa} />;
      case 'indicadores':
        return (
          <div className="px-6">
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Indicadores
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Configure e monitore os principais indicadores de desempenho
            </p>
          </div>
        );
      case 'lancamentos':
        return (
          <div className="px-6">
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Lançamentos
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Registre e acompanhe todos os lançamentos financeiros
            </p>
          </div>
        );
      case 'lanc_clientes':
        return (
          <div className="px-6">
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Lançamentos de Clientes
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Gerencie os lançamentos específicos de cada cliente
            </p>
          </div>
        );
      case 'registro_vendas':
        return (
          <div className="px-6">
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Registro de Vendas
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Acompanhe o histórico completo de vendas e faturamento
            </p>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Conteúdo em desenvolvimento
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full">
      <div className="px-6 mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Banco de Dados
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Gerencie todos os dados e métricas do sistema de forma centralizada
        </p>
      </div>

      <div className={`px-6 ${isDark ? 'bg-[#151515]' : 'bg-white'} py-4 rounded-xl mb-6`}>
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

      {getTabContent()}
    </div>
  );
};

export default BancoDados;