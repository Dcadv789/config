import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import UsuariosHeader from './UsuariosHeader';
import UsuariosFilter from './UsuariosFilter';
import UsuariosTable from './UsuariosTable';
import NovoUsuarioModal from './NovoUsuarioModal';
import ImportarUsuariosModal from './ImportarUsuariosModal';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  empresa_id: string;
  ativo: boolean;
}

interface UsuariosTabProps {
  empresaId: string;
}

const UsuariosTab: React.FC<UsuariosTabProps> = ({ empresaId }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ativos' | 'inativos' | 'todos'>('ativos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, [empresaId, statusFilter]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      let query = supabase.from('usuarios').select('*');
      
      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }

      if (statusFilter !== 'todos') {
        query = query.eq('ativo', statusFilter === 'ativos');
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <UsuariosHeader 
        onNewUser={() => setIsModalOpen(true)}
        onImportUsers={() => setIsImportModalOpen(true)}
      />
      <UsuariosFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <UsuariosTable
        usuarios={filteredUsuarios}
        loading={loading}
      />
      <NovoUsuarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsuarios}
        empresaId={empresaId}
      />
      <ImportarUsuariosModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={fetchUsuarios}
        empresaId={empresaId}
      />
    </>
  );
};

export default UsuariosTab;