import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';

const Profile: React.FC = () => {
  const { theme } = useTheme();
  const { user, refreshUser } = useUser();
  const isDark = theme === 'dark';
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    cargo: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        telefone: user.telefone || '',
        cargo: user.cargo || '',
        avatar_url: user.avatar_url || ''
      });
    }
  }, [user]);

  const getRoleLabel = (role: string) => {
    const roles = {
      master: 'Master',
      consultor: 'Consultor',
      cliente: 'Cliente'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('usuarios')
        .update(formData)
        .eq('auth_id_new', user.auth_id_new);

      if (error) throw error;

      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        telefone: user.telefone || '',
        cargo: user.cargo || '',
        avatar_url: user.avatar_url || ''
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="h-full">
      <div className="px-6 mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Perfil do Usuário
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Gerencie suas informações pessoais e preferências de conta
        </p>
      </div>

      <div className={`rounded-xl p-6 mb-8 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-6">
          {formData.avatar_url ? (
            <img
              src={formData.avatar_url}
              alt={formData.nome}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <User className="h-12 w-12" />
            </div>
          )}
          <div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {formData.nome || 'Carregando...'}
            </h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {getRoleLabel(user?.role || '')}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Informações Pessoais
          </h3>
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nome
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDark
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDark
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDark
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    URL do Avatar
                  </label>
                  <input
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDark
                        ? 'bg-gray-800 text-white border-gray-700'
                        : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <Mail className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    {user?.email || 'Carregando...'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    {formData.telefone || 'Não informado'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Building className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    {formData.cargo || 'Não informado'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Configurações
          </h3>
          <div className="space-y-4">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Editar Perfil
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Alterar Senha
                </button>
              </>
            )}
          </div>
        </div>
      </form>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;