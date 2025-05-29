import React, { useState, useEffect } from 'react';
import { X, Loader2, Building2, Building } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { supabase } from '../../../lib/supabase';

interface NovoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  empresaId: string;
}

const NovoClienteModal: React.FC<NovoClienteModalProps> = ({ isOpen, onClose, onSuccess, empresaId }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCode, setNextCode] = useState('');
  const [formData, setFormData] = useState({
    codigo: '',
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    empresa_id: empresaId,
  });

  useEffect(() => {
    if (isOpen) {
      generateNextCode();
    }
  }, [isOpen]);

  const generateNextCode = async () => {
    try {
      const { data: clientes } = await supabase
        .from('clientes')
        .select('codigo')
        .order('codigo', { ascending: false });

      if (!clientes?.length) {
        const newCode = 'C0001';
        setNextCode(newCode);
        setFormData(prev => ({ ...prev, codigo: newCode }));
        return;
      }

      const lastCode = clientes[0].codigo;
      const numericPart = parseInt(lastCode.substring(1));
      const nextCodeNum = String(numericPart + 1).padStart(4, '0');
      const newCode = `C${nextCodeNum}`;
      setNextCode(newCode);
      setFormData(prev => ({ ...prev, codigo: newCode }));
    } catch (error) {
      console.error('Erro ao gerar próximo código:', error);
    }
  };

  const validateCode = async () => {
    const { data: existingCliente } = await supabase
      .from('clientes')
      .select('id')
      .eq('codigo', formData.codigo)
      .single();

    return !existingCliente;
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const isCodeValid = await validateCode();
      if (!isCodeValid) {
        throw new Error('Já existe um cliente cadastrado com este código');
      }

      const { error } = await supabase
        .from('clientes')
        .insert([{
          ...formData,
          ativo: true
        }]);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Erro ao criar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-lg rounded-lg ${isDark ? 'bg-[#151515]' : 'bg-white'} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Novo Cliente
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
              Código
            </label>
            <input
              type="text"
              value={formData.codigo}
              disabled
              className={`w-full px-3 py-2 rounded-lg cursor-not-allowed opacity-75 ${
                isDark
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Razão Social
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.razao_social}
                onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
                className={`w-full pl-9 pr-4 py-2 rounded-lg ${
                  isDark
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Nome Fantasia
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.nome_fantasia}
                onChange={(e) => setFormData({ ...formData, nome_fantasia: e.target.value })}
                className={`w-full pl-9 pr-4 py-2 rounded-lg ${
                  isDark
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
            </div>
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
              required
            />
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
              {loading ? 'Criando...' : 'Criar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoClienteModal;