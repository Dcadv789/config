import React from 'react';
import { Pencil, Trash2, Power } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface Servico {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  empresa?: {
    razao_social: string;
  };
}

interface ServicosTableProps {
  servicos: Servico[];
  loading: boolean;
  onEdit: (servico: Servico) => void;
  onToggleStatus: (servico: Servico) => void;
  onDelete: (servicoId: string) => void;
}

const ServicosTable: React.FC<ServicosTableProps> = ({ 
  servicos, 
  loading,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-[#151515]' : 'bg-white'}`}>
      <table className="w-full">
        <thead>
          <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <th className="px-6 py-3 text-left">
              <span className={`text-xs font-medium tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Código
              </span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className={`text-xs font-medium tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Nome
              </span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className={`text-xs font-medium tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Descrição
              </span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className={`text-xs font-medium tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Empresa
              </span>
            </th>
            <th className="w-[120px] px-6 py-3 text-right">
              <span className={`text-xs font-medium tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Ações
              </span>
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y ${isDark ? 'divide-gray-700/50' : 'divide-gray-100'}`}>
          {loading ? (
            <tr>
              <td colSpan={5} className={`px-6 py-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Carregando...
              </td>
            </tr>
          ) : servicos.length === 0 ? (
            <tr>
              <td colSpan={5} className={`px-6 py-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Nenhum serviço encontrado
              </td>
            </tr>
          ) : (
            servicos.map((servico) => (
              <tr key={servico.id} className={`${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`}>
                <td className={`px-6 py-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {servico.codigo}
                </td>
                <td className={`px-6 py-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {servico.nome}
                </td>
                <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {servico.descricao}
                </td>
                <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {servico.empresa?.razao_social || '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onToggleStatus(servico)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        servico.ativo
                          ? 'text-green-500 hover:bg-green-500/10'
                          : 'text-red-500 hover:bg-red-500/10'
                      }`}
                      title={servico.ativo ? 'Desativar serviço' : 'Ativar serviço'}
                    >
                      <Power className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(servico)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark
                          ? 'text-gray-400 hover:bg-gray-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Editar serviço"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(servico.id)}
                      className="p-1.5 rounded-lg transition-colors text-red-500 hover:bg-red-500/10"
                      title="Excluir serviço"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServicosTable;