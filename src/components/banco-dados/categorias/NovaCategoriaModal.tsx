import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { supabase } from '../../../lib/supabase';

interface NovaCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NovaCategoriaModal: React.FC<NovaCategoriaModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grupos, setGrupos] = useState<{ id: string; nome: string; }[]>([]);
  const [nextCode, setNextCode] = useState('');
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    tipo: '',
    grupo_id: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchGrupos();
      generateNextCode();
    }
  }, [isOpen]);

  const fetchGrupos = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias_grupo')
        .select('id, nome')
        .order('nome');

      if (error) throw error;
      setGrupos(data || []);
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
    }
  };

  const generateNextCode = async () => {
    try {
      const { data: categorias } = await supabase
        .from('categorias')
        .select('codigo')
        .order('codigo', { ascending: false });

      if (!categorias?.length) {
        const newCode = 'CAT001';
        setNextCode(newCode);
        setFormData(prev => ({ ...prev, codigo: newCode }));
        return;
      }

      const lastCode = categorias[0].codigo;
      const numericPart = parseInt(lastCode.substring(3));
      const nextCodeNum = String(numericPart + 1).padStart(3, '0');
      const newCode = `CAT${nextCodeNum}`;
      setNextCode(newCode);
      setFormData(prev => ({ ...prev, codigo: newCode }));
    } catch (error) {
      console.error('Erro ao gerar próximo código:', error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('categorias')
        .insert([{
          ...formData,
          codigo: nextCode,
          ativo: true,
          criado_em: new Date().toISOString(),
          modificado_em: new Date().toISOString()
        }]);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message || 'Erro ao criar categoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-lg rounded-lg ${isDark ? 'bg-[#151515]' : 'bg-white'} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Nova Categoria
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
              value={nextCode}
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
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${
                isDark
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
              rows={3}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Tipo *
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${
                isDark
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
              required
            >
              <option value="">Selecione um tipo</option>
              <option value="Receita">Receita</option>
              <option value="Despesa">Despesa</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Grupo
            </label>
            <select
              value={formData.grupo_id}
              onChange={(e) => setFormData({ ...formData, grupo_id: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${
                isDark
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
            >
              <option value="">Selecione um grupo</option>
              {grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nome}
                </option>
              ))}
            </select>
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
              {loading ? 'Criando...' : 'Criar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovaCategoriaModal;