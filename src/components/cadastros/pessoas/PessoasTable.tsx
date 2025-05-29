import React from 'react';
import { Pencil, Trash2, Power } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface Pessoa {
  id: string;
  codigo: string;
  nome: string;
  cpf: string;
  cnpj: string;
  email: string;
  telefone: string;
  cargo: string;
  Ativo: boolean;
  empresa?: {
    razao_social: string;
  };
}

interface PessoasTableProps {
  pessoas: Pessoa[];
  loading: boolean;
  onEdit: (pessoa: Pessoa) => void;
  onToggleStatus: (pessoa: Pessoa) => void;
  onDelete: (pessoaId: string) => void;
}

const PessoasTable: React.FC<PessoasTableProps> = ({ 
  pessoas, 
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

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  const getCargoLabel = (cargo: string) => {
    const cargos = {
      vendedor: 'Vendedor',
      sdr: 'SDR',
      ambos: 'Vendedor/SDR'
    };
    return cargos[cargo as keyof typeof cargos] || cargo;
  };

  const getCargoBadgeClass = (cargo: string) => {
    const baseClasses = 'px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center';
    const variants = {
      vendedor: isDark
        ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
        : 'bg-blue-50 text-blue-700 border border-blue-200',
      sdr: isDark
        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'
        : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      ambos: isDark
        ? 'bg-purple-900/30 text-purple-400 border border-purple-800'
        : 'bg-purple-50 text-purple-700 border border-purple-200'
    };
    return `${baseClasses} ${variants[cargo as keyof typeof variants] || ''}`;
  };

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
                Documentos
              </span>
            </th>
            <th className="px-6 py-3 text-left">
              <span className={`text-xs font-medium tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Cargo
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
              <td colSpan={6} className={`px-6 py-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Carregando...
              </td>
            </tr>
          ) : pessoas.length === 0 ? (
            <tr>
              <td colSpan={6} className={`px-6 py-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Nenhuma pessoa encontrada
              </td>
            </tr>
          ) : (
            pessoas.map((pessoa) => (
              <tr key={pessoa.id} className={`${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`}>
                <td className={`px-6 py-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {pessoa.codigo}
                </td>
                <td className={`px-6 py-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {pessoa.nome}
                </td>
                <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex flex-col">
                    {pessoa.cpf && <span>CPF: {formatCPF(pessoa.cpf)}</span>}
                    {pessoa.cnpj && <span>CNPJ: {formatCNPJ(pessoa.cnpj)}</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={getCargoBadgeClass(pessoa.cargo)}>
                    {getCargoLabel(pessoa.cargo)}
                  </span>
                </td>
                <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {pessoa.empresa?.razao_social || '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onToggleStatus(pessoa)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        pessoa.Ativo
                          ? 'text-green-500 hover:bg-green-500/10'
                          : 'text-red-500 hover:bg-red-500/10'
                      }`}
                      title={pessoa.Ativo ? 'Desativar pessoa' : 'Ativar pessoa'}
                    >
                      <Power className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(pessoa)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark
                          ? 'text-gray-400 hover:bg-gray-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Editar pessoa"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(pessoa.id)}
                      className="p-1.5 rounded-lg transition-colors text-red-500 hover:bg-red-500/10"
                      title="Excluir pessoa"
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

export default PessoasTable;