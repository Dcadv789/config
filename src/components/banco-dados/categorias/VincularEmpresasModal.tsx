import React, { useState, useEffect } from 'react';
import { X, Loader2, Building2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { supabase } from '../../../lib/supabase';

interface Empresa {
  id: string;
  razao_social: string;
  selected?: boolean;
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
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

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

      // Cria um Set com os IDs das empresas vinculadas
      const vinculadasIds = new Set(vinculadas?.map(v => v.empresa_id) || []);

      // Marca as empresas que já estão vinculadas
      const empresasFormatadas = todasEmpresas?.map(empresa => ({
        ...empresa,
        selected: vinculadasIds.has(empresa.id)
      })) || [];

      setEmpresas(empresasFormatadas);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
      const empresasSelecionadas = empresas.filter(empresa => empresa.selected);
      if (empresasSelecionadas.length > 0) {
        const vinculos = empresasSelecionadas.map(empresa => ({
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
      <div className={`w-full max-w-2xl rounded-lg ${isDark ? 'bg-[#151515]' : 'bg-white'} p-6`}>
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

        <div className={`border rounded-lg overflow-hidden ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
              <tr>
                <th className="w-16 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={empresas.length > 0 && empresas.every(empresa => empresa.selected)}
                    onChange={(e) => {
                      setEmpresas(empresas.map(empresa => ({
                        ...empresa,
                        selected: e.target.checked
                      })));
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Razão Social
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={2} className={`px-4 py-3 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Carregando empresas...
                    </div>
                  </td>
                </tr>
              ) : empresas.length === 0 ? (
                <tr>
                  <td colSpan={2} className={`px-4 py-3 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="flex items-center justify-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Nenhuma empresa encontrada
                    </div>
                  </td>
                </tr>
              ) : (
                empresas.map((empresa) => (
                  <tr key={empresa.id} className={`${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={empresa.selected}
                        onChange={(e) => {
                          setEmpresas(empresas.map(emp =>
                            emp.id === empresa.id
                              ? { ...emp, selected: e.target.checked }
                              : emp
                          ));
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {empresa.razao_social}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
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