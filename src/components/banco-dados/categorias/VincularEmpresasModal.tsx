import React, { useState, useEffect } from 'react';
import { X, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { supabase } from '../../../lib/supabase';

interface Empresa {
  id: string;
  razao_social: string;
}

interface VincularEmpresasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoriaId: string;
}

const VincularEmpresasModal: React.FC<VincularEmpresasModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categoriaId
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [empresasDisponiveis, setEmpresasDisponiveis] = useState<Empresa[]>([]);
  const [empresasVinculadas, setEmpresasVinculadas] = useState<Empresa[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchEmpresas();
    }
  }, [isOpen, categoriaId]);

  const fetchEmpresas = async () => {
    setLoading(true);
    setError(null);

    try {
      // Busca todas as empresas
      const { data: todasEmpresas, error: empresasError } = await supabase
        .from('empresas')
        .select('id, razao_social')
        .order('razao_social');

      if (empresasError) throw empresasError;

      // Busca as empresas já vinculadas
      const { data: vinculadas, error: vinculadasError } = await supabase
        .from('categorias_empresas')
        .select('empresa_id')
        .eq('categoria_id', categoriaId);

      if (vinculadasError) throw vinculadasError;

      // Separa as empresas em vinculadas e disponíveis
      const vinculadasIds = new Set(vinculadas?.map(v => v.empresa_id) || []);
      
      const empresasVinc = todasEmpresas?.filter(empresa => vinculadasIds.has(empresa.id)) || [];
      const empresasDisp = todasEmpresas?.filter(empresa => !vinculadasIds.has(empresa.id)) || [];

      setEmpresasVinculadas(empresasVinc);
      setEmpresasDisponiveis(empresasDisp);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const moverParaVinculadas = (empresa: Empresa) => {
    setEmpresasDisponiveis(prev => prev.filter(e => e.id !== empresa.id));
    setEmpresasVinculadas(prev => [...prev, empresa].sort((a, b) => a.razao_social.localeCompare(b.razao_social)));
  };

  const moverParaDisponiveis = (empresa: Empresa) => {
    setEmpresasVinculadas(prev => prev.filter(e => e.id !== empresa.id));
    setEmpresasDisponiveis(prev => [...prev, empresa].sort((a, b) => a.razao_social.localeCompare(b.razao_social)));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Remove todos os vínculos existentes
      const { error: deleteError } = await supabase
        .from('categorias_empresas')
        .delete()
        .eq('categoria_id', categoriaId);

      if (deleteError) throw deleteError;

      // Cria os novos vínculos
      if (empresasVinculadas.length > 0) {
        const vinculos = empresasVinculadas.map(empresa => ({
          categoria_id: categoriaId,
          empresa_id: empresa.id
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
      <div className={`w-full max-w-5xl rounded-lg ${isDark ? 'bg-[#151515]' : 'bg-white'} p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Vincular Empresas
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

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="flex gap-4">
            {/* Empresas Disponíveis */}
            <div className={`flex-1 border rounded-lg ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`p-3 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'} rounded-t-lg`}>
                <h4 className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Empresas Disponíveis ({empresasDisponiveis.length})
                </h4>
              </div>
              <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                {empresasDisponiveis.map(empresa => (
                  <button
                    key={empresa.id}
                    onClick={() => moverParaVinculadas(empresa)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors
                      ${isDark 
                        ? 'hover:bg-gray-800 bg-gray-900/50 text-gray-200' 
                        : 'hover:bg-gray-100 bg-gray-50 text-gray-700'}`}
                  >
                    <span>{empresa.razao_social}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ))}
                {empresasDisponiveis.length === 0 && (
                  <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Nenhuma empresa disponível
                  </p>
                )}
              </div>
            </div>

            {/* Empresas Vinculadas */}
            <div className={`flex-1 border rounded-lg ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`p-3 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'} rounded-t-lg`}>
                <h4 className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Empresas Vinculadas ({empresasVinculadas.length})
                </h4>
              </div>
              <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                {empresasVinculadas.map(empresa => (
                  <button
                    key={empresa.id}
                    onClick={() => moverParaDisponiveis(empresa)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors
                      ${isDark 
                        ? 'hover:bg-gray-800 bg-gray-900/50 text-gray-200' 
                        : 'hover:bg-gray-100 bg-gray-50 text-gray-700'}`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{empresa.razao_social}</span>
                  </button>
                ))}
                {empresasVinculadas.length === 0 && (
                  <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Nenhuma empresa vinculada
                  </p>
                )}
              </div>
            </div>
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
            disabled={saving}
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

export default VincularEmpresasModal;