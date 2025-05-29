import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import ClientesHeader from './ClientesHeader';
import ClientesFilter from './ClientesFilter';
import ClientesTable from './ClientesTable';
import NovoClienteModal from './NovoClienteModal';
import EditarClienteModal from './EditarClienteModal';

interface Cliente {
  id: string;
  codigo: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  empresa_id: string;
  ativo: boolean;
  empresa?: {
    razao_social: string;
  };
}

interface ClientesTabProps {
  empresaId: string;
}

const ClientesTab: React.FC<ClientesTabProps> = ({ empresaId }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ativos' | 'inativos' | 'todos'>('ativos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    fetchClientes();
  }, [empresaId, statusFilter]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('clientes')
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

      const { data, error } = await query;
      
      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsEditModalOpen(true);
  };

  const handleToggleClienteStatus = async (cliente: Cliente) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .update({ ativo: !cliente.ativo })
        .eq('id', cliente.id);

      if (error) throw error;
      fetchClientes();
    } catch (error) {
      console.error('Erro ao atualizar status do cliente:', error);
    }
  };

  const handleDeleteCliente = async (clienteId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', clienteId);

      if (error) throw error;
      fetchClientes();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.codigo.includes(searchTerm)
  );

  return (
    <>
      <div className="px-6">
        <ClientesHeader 
          onNewCliente={() => setIsModalOpen(true)}
        />
      </div>
      <ClientesFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <ClientesTable
        clientes={filteredClientes}
        loading={loading}
        onEdit={handleEditCliente}
        onToggleStatus={handleToggleClienteStatus}
        onDelete={handleDeleteCliente}
      />
      <NovoClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchClientes}
        empresaId={empresaId}
      />
      {selectedCliente && (
        <EditarClienteModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCliente(null);
          }}
          onSuccess={fetchClientes}
          cliente={selectedCliente}
        />
      )}
    </>
  );
};

export default ClientesTab;