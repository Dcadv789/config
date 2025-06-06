import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import CategoriasHeader from './CategoriasHeader';
import CategoriasFilter from './CategoriasFilter';
import CategoriasLista from './CategoriasLista';
import EditarCategoriaModal from './EditarCategoriaModal';
import EditarGrupoModal from './EditarGrupoModal';
import VincularEmpresasModal from './VincularEmpresasModal';
import NovaCategoriaModal from './NovaCategoriaModal';
import NovoGrupoModal from './NovoGrupoModal';
import VincularMassaModal from './VincularMassaModal';

interface Categoria {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  tipo: 'Receita' | 'Despesa';
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

interface CategoriasTabProps {
  empresaId: string;
}

const CategoriasTab: React.FC<CategoriasTabProps> = ({ empresaId }) => {
  const [loading, setLoading] = useState(true);
  const [grupos, setGrupos] = useState<GrupoCategoria[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<'receitas' | 'despesas' | 'todas'>('todas');
  const [statusFilter, setStatusFilter] = useState<'ativas' | 'inativas' | 'todas'>('ativas');
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [selectedGrupo, setSelectedGrupo] = useState<GrupoCategoria | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditGrupoModalOpen, setIsEditGrupoModalOpen] = useState(false);
  const [isVincularModalOpen, setIsVincularModalOpen] = useState(false);
  const [isNovaCategoriaModalOpen, setIsNovaCategoriaModalOpen] = useState(false);
  const [isNovoGrupoModalOpen, setIsNovoGrupoModalOpen] = useState(false);
  const [isVincularMassaModalOpen, setIsVincularMassaModalOpen] = useState(false);

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
        categoriasQuery = categoriasQuery.eq('tipo', tipoFilter === 'receitas' ? 'Receita' : 'Despesa');
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
    setIsNovoGrupoModalOpen(true);
  };

  const handleNewCategoria = () => {
    setIsNovaCategoriaModalOpen(true);
  };

  const handleVincularMassa = () => {
    setIsVincularMassaModalOpen(true);
  };

  const handleEditGrupo = async (grupoId: string) => {
    const grupo = grupos.find(g => g.id === grupoId);
    if (grupo) {
      setSelectedGrupo(grupo);
      setIsEditGrupoModalOpen(true);
    }
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

  const handleEditCategoria = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setIsEditModalOpen(true);
  };

  const handleEditEmpresasVinculadas = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setIsVincularModalOpen(true);
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
      
      {selectedCategoria && (
        <>
          <EditarCategoriaModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedCategoria(null);
            }}
            onSuccess={fetchCategorias}
            categoria={selectedCategoria}
          />
          
          <VincularEmpresasModal
            isOpen={isVincularModalOpen}
            onClose={() => {
              setIsVincularModalOpen(false);
              setSelectedCategoria(null);
            }}
            onSuccess={fetchCategorias}
            categoriaId={selectedCategoria.id}
          />
        </>
      )}

      {selectedGrupo && (
        <EditarGrupoModal
          isOpen={isEditGrupoModalOpen}
          onClose={() => {
            setIsEditGrupoModalOpen(false);
            setSelectedGrupo(null);
          }}
          onSuccess={fetchCategorias}
          grupo={selectedGrupo}
        />
      )}

      <NovaCategoriaModal
        isOpen={isNovaCategoriaModalOpen}
        onClose={() => setIsNovaCategoriaModalOpen(false)}
        onSuccess={fetchCategorias}
      />

      <NovoGrupoModal
        isOpen={isNovoGrupoModalOpen}
        onClose={() => setIsNovoGrupoModalOpen(false)}
        onSuccess={fetchCategorias}
      />

      <VincularMassaModal
        isOpen={isVincularMassaModalOpen}
        onClose={() => setIsVincularMassaModalOpen(false)}
        onSuccess={fetchCategorias}
      />
    </>
  );
};

export default CategoriasTab;