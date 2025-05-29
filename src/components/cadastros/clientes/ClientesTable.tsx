import React from 'react';
import { Pencil, Trash2, Power } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  ativo: boolean;
  empresa?: {
    razao_social: string;
  };
}

interface ClientesTableProps {
  clientes: Cliente[];
  loading: boolean;
  onEdit: (cliente: Cliente) => void;
  onToggleStatus: (cliente: Cliente) => void;
  onDelete: (clienteId: string) => void;
}

const ClientesTable: React.FC<ClientesTableProps> = ({ 
  clientes, 
  loading,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const formatCPF = (cpf: string) => {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  };

  return (
    <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-[#151515]' : 'bg-white'}`}>
      <table className="w-full">
        <thead>
          <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <th className="px-6 py-3 text-left">
              <span className={`text-xs font-medium tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Nome
              </span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className={`text-xs font-medium tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                CPF
              </span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className={`text-xs font-medium tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Contato
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
          ) : clientes.length === 0 ? (
            <tr>
              <td colSpan={5} className={`px-6 py-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Nenhum cliente encontrado
              </td>
            </tr>
          ) : (
            clientes.map((cliente) => (
              <tr key={cliente.id} className={`${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`}>
                <td className={`px-6 py-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {cliente.nome}
                </td>
                <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {formatCPF(cliente.cpf)}
                </td>
                <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex flex-col">
                    <span>{cliente.email}</span>
                    <span className="text-sm opacity-75">{cliente.telefone}</span>
                  </div>
                </td>
                <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {cliente.empresa?.razao_social || '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onToggleStatus(cliente)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        cliente.ativo
                          ? 'text-green-500 hover:bg-green-500/10'
                          : 'text-red-500 hover:bg-red-500/10'
                      }`}
                      title={cliente.ativo ? 'Desativar cliente' : 'Ativar cliente'}
                    >
                      <Power className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(cliente)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark
                          ? 'text-gray-400 hover:bg-gray-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Editar cliente"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(cliente.id)}
                      className="p-1.5 rounded-lg transition-colors text-red-500 hover:bg-red-500/10"
                      title="Excluir cliente"
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

export default ClientesTable;