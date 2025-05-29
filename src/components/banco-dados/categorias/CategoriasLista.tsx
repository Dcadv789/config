import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Building, Pencil, Trash2, Power } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface Categoria {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  tipo: 'receita' | 'despesa';
  ativo: boolean;
  grupo_id: string;
  criado_em: string;
  modificado_em: string;
}

interface GrupoCategoria {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  criado_em: string;
  modificado_em: string;
  categorias: Categoria[];
}

interface CategoriasListaProps {
  grupos: GrupoCategoria[];
  loading?: boolean;
  onEditGrupo: (grupoId: string) => void;
  onDeleteGrupo: (grupoId: string) => void;
  onEditCategoria: (categoriaId: string) => void;
  onDeleteCategoria: (categoriaId: string) => void;
  onToggleCategoriaStatus: (categoriaId: string) => void;
  onEditEmpresasVinculadas: (categoriaId: string) => void;
}

const CategoriasLista: React.FC<CategoriasListaProps> = ({
  grupos,
  loading = false,
  onEditGrupo,
  onDeleteGrupo,
  onEditCategoria,
  onDeleteCategoria,
  onToggleCategoriaStatus,
  onEditEmpresasVinculadas
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (grupoId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(grupoId)) {
      newExpanded.delete(grupoId);
    } else {
      newExpanded.add(grupoId);
    }
    setExpandedGroups(newExpanded);
  };

  if (loading) {
    return (
      <div className={`rounded-lg ${isDark ? 'bg-[#151515]' : 'bg-white'} p-8`}>
        <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Carregando categorias...
        </div>
      </div>
    );
  }

  if (grupos.length === 0) {
    return (
      <div className={`rounded-lg ${isDark ? 'bg-[#151515]' : 'bg-white'} p-8`}>
        <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Nenhuma categoria encontrada
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-[#151515]' : 'bg-white'}`}>
      {grupos.map((grupo) => (
        <div key={grupo.id} className={`border-b last:border-b-0 ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
          {/* Cabeçalho do Grupo */}
          <div className={`${isDark ? 'bg-gray-800/30' : 'bg-gray-50'} px-6 py-3`}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleGroup(grupo.id)}
                className="flex items-center gap-2"
              >
                {expandedGroups.has(grupo.id) ? (
                  <ChevronDown className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                ) : (
                  <ChevronRight className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                )}
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {grupo.nome}
                </span>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  ({grupo.categorias.length} {grupo.categorias.length === 1 ? 'categoria' : 'categorias'})
                </span>
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEditGrupo(grupo.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark
                      ? 'text-gray-400 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Editar grupo"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteGrupo(grupo.id)}
                  className="p-1.5 rounded-lg transition-colors text-red-500 hover:bg-red-500/10"
                  title="Excluir grupo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Categorias do Grupo */}
          {expandedGroups.has(grupo.id) && (
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
                      Tipo
                    </span>
                  </th>
                  <th className="w-[180px] px-6 py-3 text-right">
                    <span className={`text-xs font-medium tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Ações
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700/50' : 'divide-gray-100'}`}>
                {grupo.categorias.map((categoria) => (
                  <tr key={categoria.id} className={`${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {categoria.codigo}
                    </td>
                    <td className={`px-6 py-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {categoria.nome}
                    </td>
                    <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                        ${categoria.tipo === 'receita'
                          ? isDark
                            ? 'bg-green-900/30 text-green-400 border border-green-800'
                            : 'bg-green-50 text-green-700 border border-green-200'
                          : isDark
                            ? 'bg-red-900/30 text-red-400 border border-red-800'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {categoria.tipo === 'receita' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditEmpresasVinculadas(categoria.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark
                              ? 'text-gray-400 hover:bg-gray-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title="Ver/Editar empresas vinculadas"
                        >
                          <Building className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onToggleCategoriaStatus(categoria.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            categoria.ativo
                              ? 'text-green-500 hover:bg-green-500/10'
                              : 'text-red-500 hover:bg-red-500/10'
                          }`}
                          title={categoria.ativo ? 'Desativar categoria' : 'Ativar categoria'}
                        >
                          <Power className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditCategoria(categoria.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark
                              ? 'text-gray-400 hover:bg-gray-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title="Editar categoria"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteCategoria(categoria.id)}
                          className="p-1.5 rounded-lg transition-colors text-red-500 hover:bg-red-500/10"
                          title="Excluir categoria"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoriasLista;