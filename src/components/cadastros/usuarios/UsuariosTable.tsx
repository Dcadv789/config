import React from 'react';
import { Pencil, Trash2, Power } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  role: string;
  ativo: boolean;
}

interface UsuariosTableProps {
  usuarios: Usuario[];
  loading: boolean;
  onEdit: (user: Usuario) => void;
  onToggleStatus: (user: Usuario) => void;
  onDelete: (userId: string) => void;
}

const UsuariosTable: React.FC<UsuariosTableProps> = ({ 
  usuarios, 
  loading,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="px-6">
      <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-[#151515]' : 'bg-white'} shadow-sm`}>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className="px-6 py-4 text-left">
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Nome
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  E-mail
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Cargo
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Empresa
                </span>
              </th>
              <th className="w-[120px] px-6 py-4 text-right">
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Ações
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={5} className={`px-6 py-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Carregando...
                </td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan={5} className={`px-6 py-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id} className={`${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`}>
                  <td className={`px-6 py-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {usuario.nome}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {usuario.email}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {usuario.cargo}
                  </td>
                  <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Empresa XYZ
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onToggleStatus(usuario)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          usuario.ativo
                            ? 'text-green-500 hover:bg-green-500/10'
                            : 'text-red-500 hover:bg-red-500/10'
                        }`}
                        title={usuario.ativo ? 'Desativar usuário' : 'Ativar usuário'}
                      >
                        <Power className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(usuario)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDark
                            ? 'text-gray-400 hover:bg-gray-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title="Editar usuário"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(usuario.id)}
                        className="p-1.5 rounded-lg transition-colors text-red-500 hover:bg-red-500/10"
                        title="Excluir usuário"
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
    </div>
  );
};

export default UsuariosTable;