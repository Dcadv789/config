import React, { useState, useEffect } from 'react';
import { X, Loader2, ArrowRight, ArrowLeft, Building } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { supabase } from '../../../lib/supabase';

interface Empresa {
  id: string;
  razao_social: string;
}

interface Categoria {
  id: string;
  codigo: string;
  nome: string;
  tipo: string;
}

interface VincularMassaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VincularMassaModal: React.FC<VincularMassaModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('');
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<Categoria[]>([]);
  const [categoriasVinculadas, setCategoriasVinculadas] = useState<Categoria[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchEmpresas();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedEmpresa) {
      fetchCategorias();
    } else {
      setCategoriasDisponiveis([]);
      setCategoriasVinculadas([]);
    }
  }, [selectedEmpresa]);

  const fetchEmpresas = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, razao_social')
        .order('razao_social');

      if (error) throw error;
      setEmpresas(data || []);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    }
  };

  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);

    try {
      // Busca todas as categorias
      const { data: todasCategorias, error: categoriasError } = await supabase
        .from('categorias')
        .select('id, codigo, nome, tipo')
        .order('codigo');

      if (categoriasError) throw categoriasError;

      // Busca as categorias já vinculadas à empresa
      const { data: vinculadas, error: vinculadasError } = await supabase
        .from('categorias_empresas')
        .select('categoria_id')
        .eq('empresa_id', selectedEmpresa);

      if (vinculadasError) throw vinculadasError;

      // Separa as categorias em vinculadas e disponíveis
      const vinculadasIds = new Set(vinculadas?.map(v => v.categoria_id) || []);
      
      const categoriasVinc = todasCategorias?.filter(cat => vinculadasIds.has(cat.id)) || [];
      const categoriasDisp = todasCategorias?.filter(cat => !vinculadasIds.has(cat.id)) || [];

      setCategoriasVinculadas(categoriasVinc);
      setCategoriasDisponiveis(categoriasDisp);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const moverParaVinculadas = (categoria: Categoria) => {
    setCategoriasDisponiveis(prev => prev.filter(c => c.id !== categoria.id));
    setCategoriasVinculadas(prev => [...prev, categoria].sort((a, b) => a.codigo.localeCompare(b.codigo)));
  };

  const moverParaDisponiveis = (categoria: Categoria) => {
    setCategoriasVinculadas(prev => prev.filter(c => c.id !== categoria.id));
    setCategoriasDisponiveis(prev => [...prev, categoria].sort((a, b) => a.codigo.localeCompare(b.codigo)));
  };

  const handleSave = async () => {
    if (!selectedEmpresa) {
      setError('Selecione uma empresa primeiro');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Remove todos os vínculos existentes
      const { error: deleteError } = await supabase
        .from('categorias_empresas')
        .delete()
        .eq('empresa_id', selectedEmpresa);

      if (deleteError) throw deleteError;

      // Cria os novos vínculos
      if (categoriasVinculadas.length > 0) {
        const vinculos = categoriasVinculadas.map(categoria => ({
          categoria_id: categoria.id,
          empresa_id: selectedEmpresa
        }));

        const { error: insertError } = await supabase
          .from('categorias_empresas')
          .insert(vinculos);

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-5xl rounded-lg ${isDark ? 'bg-[#151515]' : 'bg-white'} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Vincular Categorias em Massa
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

        <div className="mb-6">
          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Selecione uma Empresa
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedEmpresa}
              onChange={(e) => setSelectedEmpresa(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-lg appearance-none ${
                isDark
                  ? 'bg-gray-800 text-white border-gray-700'
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
            >
              <option value="">Selecione uma empresa</option>
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.razao_social}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : selectedEmpresa ? (
          <div className="flex gap-4">
            {/* Categorias Disponíveis */}
            <div className={`flex-1 border rounded-lg ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`p-3 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'} rounded-t-lg`}>
                <h4 className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Categorias Disponíveis ({categoriasDisponiveis.length})
                </h4>
              </div>
              <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                {categoriasDisponiveis.map(categoria => (
                  <button
                    key={categoria.id}
                    onClick={() => moverParaVinculadas(categoria)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors
                      ${isDark 
                        ? 'hover:bg-gray-800 bg-gray-900/50 text-gray-200' 
                        : 'hover:bg-gray-100 bg-gray-50 text-gray-700'}`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{categoria.codigo} - {categoria.nome}</span>
                      <span className={`text-xs ${
                        categoria.tipo === 'Receita'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}>
                        {categoria.tipo}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ))}
                {categoriasDisponiveis.length === 0 && (
                  <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Nenhuma categoria disponível
                  </p>
                )}
              </div>
            </div>

            {/* Categorias Vinculadas */}
            <div className={`flex-1 border rounded-lg ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`p-3 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'} rounded-t-lg`}>
                <h4 className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Categorias Vinculadas ({categoriasVinculadas.length})
                </h4>
              </div>
              <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                {categoriasVinculadas.map(categoria => (
                  <button
                    key={categoria.id}
                    onClick={() => moverParaDisponiveis(categoria)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors
                      ${isDark 
                        ? 'hover:bg-gray-800 bg-gray-900/50 text-gray-200' 
                        : 'hover:bg-gray-100 bg-gray-50 text-gray-700'}`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <div className="flex flex-col items-end">
                      <span className="font-medium">{categoria.codigo} - {categoria.nome}</span>
                      <span className={`text-xs ${
                        categoria.tipo === 'Receita'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}>
                        {categoria.tipo}
                      </span>
                    </div>
                  </button>
                ))}
                {categoriasVinculadas.length === 0 && (
                  <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Nenhuma categoria vinculada
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Selecione uma empresa para visualizar as categorias
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              isDark
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selectedEmpresa}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VincularMassaModal;