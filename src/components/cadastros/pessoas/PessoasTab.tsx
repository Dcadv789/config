import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import PessoasHeader from './PessoasHeader';
import PessoasFilter from './PessoasFilter';
import PessoasTable from './PessoasTable';
import NovaPessoaModal from './NovaPessoaModal';
import EditarPessoaModal from './EditarPessoaModal';

interface Pessoa {
  id: string;
  codigo: string;
  nome: string;
  cpf: string;
  cnpj: string;
  email: string;
  telefone: string;
  cargo: string;
  Empresa_ID: string;
  Ativo: boolean;
  empresas?: {
    razao_social: string;
  };
}

interface PessoasTabProps {
  empresaId: string;
}

const PessoasTab: React.FC<PessoasTabProps> = ({ empresaId }) => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ativos' | 'inativos' | 'todos'>('ativos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null);

  useEffect(() => {
    fetchPessoas();
  }, [empresaId, statusFilter]);

  const fetchPessoas = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('pessoas')
        .select(`
          *,
          empresas(razao_social)
        `);
      
      if (empresaId) {
        query = query.eq('Empresa_ID', empresaId);
      }

      if (statusFilter !== 'todos') {
        query = query.eq('Ativo', statusFilter === 'ativos');
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setPessoas(data || []);
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPessoa = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa);
    setIsEditModalOpen(true);
  };

  const handleTogglePessoaStatus = async (pessoa: Pessoa) => {
    try {
      const { error } = await supabase
        .from('pessoas')
        .update({ Ativo: !pessoa.Ativo })
        .eq('id', pessoa.id);

      if (error) throw error;
      fetchPessoas();
    } catch (error) {
      console.error('Erro ao atualizar status da pessoa:', error);
    }
  };

  const handleDeletePessoa = async (pessoaId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pessoa?')) return;

    try {
      const { error } = await supabase
        .from('pessoas')
        .delete()
        .eq('id', pessoaId);

      if (error) throw error;
      fetchPessoas();
    } catch (error) {
      console.error('Erro ao excluir pessoa:', error);
    }
  };

  const filteredPessoas = pessoas.filter(pessoa =>
    pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pessoa.cpf.includes(searchTerm) ||
    pessoa.cnpj.includes(searchTerm)
  );

  return (
    <>
      <div className="px-6">
        <PessoasHeader 
          onNewPessoa={() => setIsModalOpen(true)}
          empresaId={empresaId}
        />
      </div>
      <PessoasFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <PessoasTable
        pessoas={filteredPessoas}
        loading={loading}
        onEdit={handleEditPessoa}
        onToggleStatus={handleTogglePessoaStatus}
        onDelete={handleDeletePessoa}
      />
      <NovaPessoaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPessoas}
        empresaId={empresaId}
      />
      {selectedPessoa && (
        <EditarPessoaModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPessoa(null);
          }}
          onSuccess={fetchPessoas}
          pessoa={selectedPessoa}
        />
      )}
    </>
  );
};

export default PessoasTab;