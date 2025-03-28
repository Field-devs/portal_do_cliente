import React, { useState, useEffect } from 'react';
import {
  Palette,
  Upload,
  Save,
  AlertCircle,
  Loader2,
  History,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';
import '../../Styles/animations.css';

interface BrandingSettings {
  primary_color: string;
  secondary_color: string;
  logo_url: string;
  favicon_url: string;
  font_family: string;
  version: number;
}

interface BrandingHistory {
  id: string;
  settings: BrandingSettings;
  created_at: string;
  created_by: string;
}

export default function BrandingSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<BrandingHistory[]>([]);

  const [settings, setSettings] = useState<BrandingSettings>({
    primary_color: '#1E3A8A',
    secondary_color: '#3B82F6',
    logo_url: '',
    favicon_url: '',
    font_family: 'Inter',
    version: 1
  });

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputClass = "w-full px-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm";

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data: settings, error } = await supabase
        .from('configuracoes')
        .select('branding_settings, branding_history')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (settings) {
        setSettings(settings.branding_settings || settings);
        setHistory(settings.branding_history || []);
      }
    } catch (error) {
      console.error('Error fetching branding settings:', error);
      setError('Erro ao carregar configurações de marca');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Add current settings to history
      const historyEntry: BrandingHistory = {
        id: crypto.randomUUID(),
        settings: { ...settings },
        created_at: new Date().toISOString(),
        created_by: user?.nome || ''
      };

      const updatedHistory = [historyEntry, ...history].slice(0, 10); // Keep last 10 versions

      const { error } = await supabase
        .from('configuracoes')
        .update({
          branding_settings: { ...settings, version: settings.version + 1 },
          branding_history: updatedHistory
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setHistory(updatedHistory);
      setSettings(prev => ({ ...prev, version: prev.version + 1 }));
    } catch (error) {
      console.error('Error saving branding settings:', error);
      setError('Erro ao salvar configurações de marca');
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = (historyEntry: BrandingHistory) => {
    setSettings(historyEntry.settings);
    setShowHistory(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('branding')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('branding')
        .getPublicUrl(filePath);

      setSettings(prev => ({
        ...prev,
        [type === 'logo' ? 'logo_url' : 'favicon_url']: publicUrl
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Erro ao fazer upload do arquivo');
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Color Settings */}
      <div className={cardClass}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Cores da Marca
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Color */}
          <div>
            <label className={labelClass}>Cor Primária</label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={settings.primary_color}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                className="h-12 w-12 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.primary_color}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div>
            <label className={labelClass}>Cor Secundária</label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={settings.secondary_color}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                className="h-12 w-12 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondary_color}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logo and Favicon */}
      <div className={cardClass}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Logo e Favicon
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div>
            <label className={labelClass}>Logo</label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-light-border dark:border-gray-700/50 rounded-lg">
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label className="relative cursor-pointer rounded-md font-medium text-brand hover:text-brand/80">
                    <span>Upload um arquivo</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                    />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF até 10MB
                </p>
              </div>
            </div>
            {settings.logo_url && (
              <div className="mt-4">
                <img
                  src={settings.logo_url}
                  alt="Logo Preview"
                  className="h-16 object-contain"
                />
              </div>
            )}
          </div>

          {/* Favicon Upload */}
          <div>
            <label className={labelClass}>Favicon</label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-light-border dark:border-gray-700/50 rounded-lg">
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label className="relative cursor-pointer rounded-md font-medium text-brand hover:text-brand/80">
                    <span>Upload um arquivo</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/x-icon,image/png"
                      onChange={(e) => handleFileUpload(e, 'favicon')}
                    />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ICO, PNG até 1MB
                </p>
              </div>
            </div>
            {settings.favicon_url && (
              <div className="mt-4">
                <img
                  src={settings.favicon_url}
                  alt="Favicon Preview"
                  className="h-8 w-8 object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Font Settings */}
      <div className={cardClass}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Tipografia
        </h2>

        <div>
          <label className={labelClass}>Fonte Principal</label>
          <select
            value={settings.font_family}
            onChange={(e) => setSettings({ ...settings, font_family: e.target.value })}
            className={inputClass}
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Montserrat">Montserrat</option>
          </select>
        </div>
      </div>

      {/* Version History */}
      <div className={cardClass}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Histórico de Versões
          </h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-brand hover:text-brand/80"
          >
            <History className="h-5 w-5" />
          </button>
        </div>

        {showHistory && (
          <div className="space-y-4">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-light-secondary dark:bg-[#0F172A]/60 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Versão {entry.settings.version}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(entry.created_at).toLocaleString()} por {entry.created_by}
                  </p>
                </div>
                <button
                  onClick={() => handleRevert(entry)}
                  className="text-brand hover:text-brand/80"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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