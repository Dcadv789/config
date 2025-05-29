import React from 'react';
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
}

const UsuariosTable: React.FC<UsuariosTableProps> = ({ usuarios, loading }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getRoleLabel = (role: string) => {
    const roles = {
      master: 'Master',
      consultor: 'Consultor',
      cliente: 'Cliente'
    };
    return roles[role as keyof typeof roles] || role;
  };

  return (
    <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-[#151515]' : 'bg-white'}`}>
      <table className="w-full">
        <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Nome</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Email</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Cargo</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Posição</th>
            <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
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
              <tr key={usuario.id} className={`hover:${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <td className={`px-6 py-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{usuario.nome}</td>
                <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{usuario.email}</td>
                <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{usuario.cargo}</td>
                <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{getRoleLabel(usuario.role)}</td>
                <td className={`px-6 py-4`}>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    usuario.ativo
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosTable;