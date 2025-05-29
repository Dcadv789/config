import React, { useState } from 'react';
import { X, Loader2, User, Mail, Phone, Building } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { supabase } from '../../../lib/supabase';

interface NovaPessoaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  empresaId: string;
}

const NovaPessoaModal: React.FC<NovaPessoaModalProps> = ({ isOpen, onClose, onSuccess, empresaId }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    cpf: '',
    cnpj: '',
    email: '',
    telefone: '',
    cargo: '',
    empresa_id: empresaId, // Usando diretamente o empresaId sem conversão
  });

  if (!isOpen) return null;

  const generateNextCode = async () => {
    try {
      const { data: pessoas } = await supabase
        .from('pessoas')
        .select('codigo')
        .order('codigo', { ascending: false });

      if (!pessoas?.length) {
        return 'P0001';
      }

      const lastCode = pessoas[0].codigo;
      const numericPart = parseInt(lastCode.substring(1));
      const nextCodeNum = String(numericPart + 1).padStart(4, '0');
      return `P${nextCodeNum}`;
    } catch (error) {
      console.error('Erro ao gerar próximo código:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação da empresa
    if (!empresaId) {
      setError('Selecione uma empresa no filtro global antes de criar uma nova pessoa.');
      setLoading(false);
      return;
    }

    try {
      const nextCode = await generateNextCode();
      if (!nextCode) throw new Error('Erro ao gerar código');

      const { error } = await supabase
        .from('pessoas')
        .insert([{
          ...formData,
          codigo: nextCode,
          empresa_id: empresaId, // Usando diretamente o empresaId
          Ativo: true
        }]);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Erro ao criar pessoa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-lg rounded-lg ${isDark ? 'bg-[#151515]' : 'bg-white'} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Nova Pessoa
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <X className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Nome Completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className={`w-full pl-9 pr-4 py-2 rounded-lg ${
                  isDark
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                CPF
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg ${
                  isDark
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                CNPJ
              </label>
              <input
                type="text"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg ${
                  isDark
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                placeholder="00.000.000/0000-00"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-9 pr-4 py-2 rounded-lg ${
                  isDark
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className={`w-full pl-9 pr-4 py-2 rounded-lg ${
                  isDark
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Cargo
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                className={`w-full pl-9 pr-4 py-2 rounded-lg ${
                  isDark
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              >
                <option value="">Selecione um cargo</option>
                <option value="Vendedor">Vendedor</option>
                <option value="SDR">SDR</option>
                <option value="Ambos">Vendedor/SDR</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Criando...' : 'Criar Pessoa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovaPessoaModal;