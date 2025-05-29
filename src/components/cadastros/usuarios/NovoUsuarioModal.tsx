import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { supabase } from '../../../lib/supabase';

interface NovoUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  empresaId: string;
}

interface Empresa {
  id: string;
  razao_social: string;
}

type UserRole = 'master' | 'consultor' | 'cliente';

const NovoUsuarioModal: React.FC<NovoUsuarioModalProps> = ({ isOpen, onClose, onSuccess, empresaId }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    avatar_url: '',
    cargo: '',
    role: '' as UserRole,
    empresa_id: empresaId,
  });

  useEffect(() => {
    const fetchEmpresas = async () => {
      const { data } = await supabase.from('empresas').select('id, razao_social');
      if (data) setEmpresas(data);
    };
    fetchEmpresas();
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Primeiro, criar o usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: 'senha-temporaria-123', // Senha temporária que o usuário deverá alterar
      });

      if (authError) throw authError;

      // Prepare user data, setting empresa_id to null for master users
      const userData = {
        ...formData,
        empresa_id: formData.role === 'master' ? null : formData.empresa_id,
        auth_id: authData.user?.id,
        ativo: true,
      };

      // Depois, inserir na tabela de usuários com o auth_id
      const { error: dbError } = await supabase.from('usuarios').insert([userData]);

      if (dbError) throw dbError;
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    }
  };

  const inputClasses = `w-full px-3 py-2 rounded-lg ${
    isDark
      ? 'bg-gray-800 text-white border-gray-700 focus:border-indigo-500'
      : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-indigo-500'
  }`;

  const labelClasses = `block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-lg rounded-lg ${isDark ? 'bg-[#151515]' : 'bg-white'} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Novo Usuário
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <X className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClasses}>Nome Completo</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className={inputClasses}
              required
            />
          </div>

          <div className="col-span-2">
            <label className={labelClasses}>E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className={labelClasses}>Telefone</label>
            <input
              type="tel"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              className={inputClasses}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className={labelClasses}>Cargo</label>
            <input
              type="text"
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              className={inputClasses}
              required
            />
          </div>

          <div className="col-span-2">
            <label className={labelClasses}>Posição no Sistema</label>
            <select
              value={formData.role}
              onChange={(e) => {
                const newRole = e.target.value as UserRole;
                setFormData({
                  ...formData,
                  role: newRole,
                  // Clear empresa_id if role is master
                  empresa_id: newRole === 'master' ? '' : formData.empresa_id
                });
              }}
              className={inputClasses}
              required
            >
              <option value="">Selecione uma posição</option>
              <option value="master">Master</option>
              <option value="consultor">Consultor</option>
              <option value="cliente">Cliente</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className={labelClasses}>URL do Avatar</label>
            <input
              type="url"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              className={inputClasses}
              placeholder="https://exemplo.com/avatar.jpg"
            />
          </div>

          <div className="col-span-2">
            <label className={labelClasses}>Empresa</label>
            <select
              value={formData.empresa_id}
              onChange={(e) => setFormData({ ...formData, empresa_id: e.target.value })}
              className={inputClasses}
              required={formData.role !== 'master'}
              disabled={formData.role === 'master'}
            >
              <option value="">Selecione uma empresa</option>
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.razao_social}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Criar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoUsuarioModal;