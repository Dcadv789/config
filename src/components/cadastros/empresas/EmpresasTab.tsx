import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import EmpresasHeader from './EmpresasHeader';
import EmpresasFilter from './EmpresasFilter';
import EmpresasTable from './EmpresasTable';
import NovaEmpresaModal from './NovaEmpresaModal';
import EditarEmpresaModal from './EditarEmpresaModal';

interface Empresa {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  ativo: boolean;
}

const EmpresasTab: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ativas' | 'inativas' | 'todas'>('ativas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

  useEffect(() => {
    fetchEmpresas();
  }, [statusFilter]);

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('empresas')
        .select('*');
      
      if (statusFilter !== 'todas') {
        query = query.eq('ativo', statusFilter === 'ativas');
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setEmpresas(data || []);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmpresa = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setIsEditModalOpen(true);
  };

  const handleToggleEmpresaStatus = async (empresa: Empresa) => {
    try {
      const { error } = await supabase
        .from('empresas')
        .update({ ativo: !empresa.ativo })
        .eq('id', empresa.id);

      if (error) throw error;
      fetchEmpresas();
    } catch (error) {
      console.error('Erro ao atualizar status da empresa:', error);
    }
  };

  const handleDeleteEmpresa = async (empresaId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;

    try {
      const { error } = await supabase
        .from('empresas')
        .delete()
        .eq('id', empresaId);

      if (error) throw error;
      fetchEmpresas();
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
    }
  };

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cnpj.includes(searchTerm)
  );

  return (
    <>
      <div className="px-6">
        <EmpresasHeader 
          onNewEmpresa={() => setIsModalOpen(true)}
        />
      </div>
      <EmpresasFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <EmpresasTable
        empresas={filteredEmpresas}
        loading={loading}
        onEdit={handleEditEmpresa}
        onToggleStatus={handleToggleEmpresaStatus}
        onDelete={handleDeleteEmpresa}
      />
      <NovaEmpresaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEmpresas}
      />
      {selectedEmpresa && (
        <EditarEmpresaModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEmpresa(null);
          }}
          onSuccess={fetchEmpresas}
          empresa={selectedEmpresa}
        />
      )}
    </>
  );
};

export default EmpresasTab;