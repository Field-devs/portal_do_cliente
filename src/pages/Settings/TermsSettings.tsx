import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  AlertCircle,
  Loader2,
  History,
  RefreshCw,
  Check
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';

interface TermsVersion {
  id: string;
  content: string;
  version: number;
  require_acceptance: boolean;
  created_at: string;
  created_by: string;
  notes: string;
}

export default function TermsSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<TermsVersion[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const [currentTerms, setCurrentTerms] = useState<TermsVersion>({
    id: crypto.randomUUID(),
    content: '',
    version: 1,
    require_acceptance: true,
    created_at: new Date().toISOString(),
    created_by: user?.nome || '',
    notes: ''
  });

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputClass = "w-full px-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm";

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const { data: terms, error } = await supabase
        .from('configuracoes')
        .select('terms_settings, terms_history')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (terms) {
        setCurrentTerms(terms.terms_settings || currentTerms);
        setHistory(terms.terms_history || []);
      }
    } catch (error) {
      console.error('Error fetching terms:', error);
      setError('Erro ao carregar termos');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Add current terms to history
      const historyEntry: TermsVersion = {
        ...currentTerms,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        created_by: user?.nome || ''
      };

      const updatedHistory = [historyEntry, ...history].slice(0, 10); // Keep last 10 versions

      const { error } = await supabase
        .from('configuracoes')
        .update({
          terms_settings: { ...currentTerms, version: currentTerms.version + 1 },
          terms_history: updatedHistory
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setHistory(updatedHistory);
      setCurrentTerms(prev => ({ ...prev, version: prev.version + 1 }));
    } catch (error) {
      console.error('Error saving terms:', error);
      setError('Erro ao salvar termos');
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = (version: TermsVersion) => {
    setCurrentTerms(version);
    setShowHistory(false);
  };

  return (
    <div className="space-y-6">
      {/* Current Terms */}
      <div className={cardClass}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Termos de Adesão
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="text-brand hover:text-brand/80"
            >
              {previewMode ? 'Editar' : 'Visualizar'}
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-brand hover:text-brand/80"
            >
              <History className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Version Info */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Versão {currentTerms.version}
              </span>
              <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Última atualização: {new Date(currentTerms.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={currentTerms.require_acceptance}
                onChange={(e) => setCurrentTerms({ ...currentTerms, require_acceptance: e.target.checked })}
                className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Exigir aceite
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notas da Versão</label>
            <input
              type="text"
              value={currentTerms.notes}
              onChange={(e) => setCurrentTerms({ ...currentTerms, notes: e.target.value })}
              className={inputClass}
              placeholder="Descreva as alterações desta versão..."
            />
          </div>

          {/* Terms Content */}
          <div>
            <label className={labelClass}>Conteúdo dos Termos</label>
            {previewMode ? (
              <div
                className="prose prose-sm dark:prose-invert max-w-none p-4 bg-white dark:bg-gray-800 rounded-lg border border-light-border dark:border-gray-700/50"
                dangerouslySetInnerHTML={{ __html: currentTerms.content }}
              />
            ) : (
              <textarea
                value={currentTerms.content}
                onChange={(e) => setCurrentTerms({ ...currentTerms, content: e.target.value })}
                className={`${inputClass} h-96 font-mono`}
                placeholder="Digite os termos de adesão aqui..."
              />
            )}
          </div>
        </div>
      </div>

      {/* Version History */}
      {showHistory && (
        <div className={cardClass}>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Histórico de Versões
          </h3>
          <div className="space-y-4">
            {history.map((version) => (
              <div
                key={version.id}
                className="flex items-center justify-between p-4 bg-light-secondary dark:bg-[#0F172A]/60 rounded-lg"
              >
                <div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Versão {version.version}
                    </p>
                    {version.require_acceptance && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-brand/10 text-brand rounded">
                        Aceite Obrigatório
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(version.created_at).toLocaleString()} por {version.created_by}
                  </p>
                  {version.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {version.notes}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRevert(version)}
                  className="text-brand hover:text-brand/80"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-lg flex items-center text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center rounded-lg"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Salvar Alterações
            </>
          )}
        </button>
      </div>
    </div>
  );
}