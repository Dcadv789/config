import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import CategoriasHeader from './CategoriasHeader';
import CategoriasFilter from './CategoriasFilter';
import CategoriasLista from './CategoriasLista';

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

const CategoriasTab: React.FC<{ empresaId: string }> = ({ empresaId }) => {
  const [loading, setLoading] = useState(true);
  const [grupos, setGrupos] = useState<GrupoCategoria[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<'receitas' | 'despesas' | 'todas'>('todas');
  const [statusFilter, setStatusFilter] = useState<'ativas' | 'inativas' | 'todas'>('ativas');

  useEffect(() => {
    fetchCategorias();
  }, [empresaId, tipoFilter, statusFilter]);

  const fetchCategorias = async () => {
    try {
      setLoading(true);

      // Busca os grupos
      let gruposQuery = supabase
        .from('categorias_grupo')
        .select('*')
        .order('nome');

      const { data: gruposData, error: gruposError } = await gruposQuery;
      if (gruposError) throw gruposError;

      // Busca as categorias
      let categoriasQuery = supabase
        .from('categorias')
        .select('*')
        .order('codigo');

      if (tipoFilter !== 'todas') {
        categoriasQuery = categoriasQuery.eq('tipo', tipoFilter === 'receitas' ? 'receita' : 'despesa');
      }

      if (statusFilter !== 'todas') {
        categoriasQuery = categoriasQuery.eq('ativo', statusFilter === 'ativas');
      }

      const { data: categoriasData, error: categoriasError } = await categoriasQuery;
      if (categoriasError) throw categoriasError;

      // Organiza as categorias por grupo
      const gruposFormatados = gruposData.map(grupo => ({
        ...grupo,
        categorias: categoriasData
          .filter(cat => cat.grupo_id === grupo.id)
          .filter(cat => 
            cat.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.codigo.toLowerCase().includes(searchTerm.toLowerCase())
          )
      }));

      // Filtra grupos vazios se houver termo de busca
      const gruposFiltrados = searchTerm
        ? gruposFormatados.filter(grupo => grupo.categorias.length > 0)
        : gruposFormatados;

      setGrupos(gruposFiltrados);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewGrupo = () => {
    // Implementar modal de novo grupo
  };

  const handleNewCategoria = () => {
    // Implementar modal de nova categoria
  };

  const handleVincularMassa = () => {
    // Implementar modal de vinculação em massa
  };

  const handleEditGrupo = async (grupoId: string) => {
    // Implementar modal de edição de grupo
  };

  const handleDeleteGrupo = async (grupoId: string) => {
    if (!confirm('Tem certeza que deseja excluir este grupo?')) return;

    try {
      const { error } = await supabase
        .from('categorias_grupo')
        .delete()
        .eq('id', grupoId);

      if (error) throw error;
      fetchCategorias();
    } catch (error) {
      console.error('Erro ao excluir grupo:', error);
    }
  };

  const handleEditCategoria = async (categoriaId: string) => {
    // Implementar modal de edição de categoria
  };

  const handleDeleteCategoria = async (categoriaId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', categoriaId);

      if (error) throw error;
      fetchCategorias();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
    }
  };

  const handleToggleCategoriaStatus = async (categoriaId: string) => {
    try {
      const { data: categoria } = await supabase
        .from('categorias')
        .select('ativo')
        .eq('id', categoriaId)
        .single();

      if (!categoria) return;

      const { error } = await supabase
        .from('categorias')
        .update({ 
          ativo: !categoria.ativo,
          modificado_em: new Date().toISOString()
        })
        .eq('id', categoriaId);

      if (error) throw error;
      fetchCategorias();
    } catch (error) {
      console.error('Erro ao alterar status da categoria:', error);
    }
  };

  const handleEditEmpresasVinculadas = (categoriaId: string) => {
    // Implementar modal de vinculação de empresas
  };

  return (
    <>
      <div className="px-6">
        <CategoriasHeader
          onNewGrupo={handleNewGrupo}
          onNewCategoria={handleNewCategoria}
          onVincularMassa={handleVincularMassa}
        />
      </div>
      <CategoriasFilter
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          fetchCategorias();
        }}
        tipoFilter={tipoFilter}
        onTipoChange={setTipoFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <CategoriasLista
        grupos={grupos}
        loading={loading}
        onEditGrupo={handleEditGrupo}
        onDeleteGrupo={handleDeleteGrupo}
        onEditCategoria={handleEditCategoria}
        onDeleteCategoria={handleDeleteCategoria}
        onToggleCategoriaStatus={handleToggleCategoriaStatus}
        onEditEmpresasVinculadas={handleEditEmpresasVinculadas}
      />
    </>
  );
};

export default CategoriasTab;