import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import ServicosHeader from './ServicosHeader';
import ServicosFilter from './ServicosFilter';
import ServicosTable from './ServicosTable';
import NovoServicoModal from './NovoServicoModal';
import EditarServicoModal from './EditarServicoModal';

interface Servico {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  empresa_id: string;
  ativo: boolean;
  empresa?: {
    razao_social: string;
  };
}

interface ServicosTabProps {
  empresaId: string;
}

const ServicosTab: React.FC<ServicosTabProps> = ({ empresaId }) => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ativos' | 'inativos' | 'todos'>('ativos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);

  useEffect(() => {
    fetchServicos();
  }, [empresaId, statusFilter]);

  const fetchServicos = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('servicos')
        .select(`
          *,
          empresa:empresas(razao_social)
        `);
      
      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }

      if (statusFilter !== 'todos') {
        query = query.eq('ativo', statusFilter === 'ativos');
      }

      query = query.order('codigo', { ascending: true });

      const { data, error } = await query;
      
      if (error) throw error;
      setServicos(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditServico = (servico: Servico) => {
    setSelectedServico(servico);
    setIsEditModalOpen(true);
  };

  const handleToggleServicoStatus = async (servico: Servico) => {
    try {
      const { error } = await supabase
        .from('servicos')
        .update({ 
          ativo: !servico.ativo,
          modificado_em: new Date().toISOString()
        })
        .eq('id', servico.id);

      if (error) throw error;
      fetchServicos();
    } catch (error) {
      console.error('Erro ao atualizar status do serviço:', error);
    }
  };

  const handleDeleteServico = async (servicoId: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', servicoId);

      if (error) throw error;
      fetchServicos();
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
    }
  };

  const filteredServicos = servicos.filter(servico =>
    servico.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="px-6">
        <ServicosHeader 
          onNewServico={() => setIsModalOpen(true)}
          empresaId={empresaId}
        />
      </div>
      <ServicosFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <ServicosTable
        servicos={filteredServicos}
        loading={loading}
        onEdit={handleEditServico}
        onToggleStatus={handleToggleServicoStatus}
        onDelete={handleDeleteServico}
      />
      <NovoServicoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchServicos}
        empresaId={empresaId}
      />
      {selectedServico && (
        <EditarServicoModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedServico(null);
          }}
          onSuccess={fetchServicos}
          servico={selectedServico}
        />
      )}
    </>
  );
};

export default ServicosTab;