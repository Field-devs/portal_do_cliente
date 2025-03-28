import React, { useState, useEffect } from 'react';
import {
  Mail,
  Server,
  Lock,
  User,
  Eye,
  EyeOff,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';
import '../../Styles/animations.css';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

interface SMTPSettings {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  from_email: string;
  from_name: string;
}

export default function EmailSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [smtpSettings, setSmtpSettings] = useState<SMTPSettings>({
    host: '',
    port: 587,
    secure: true,
    username: '',
    password: '',
    from_email: '',
    from_name: ''
  });

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputClass = "w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm";
  const iconClass = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data: settings, error } = await supabase
        .from('configuracoes')
        .select('email_settings, email_templates')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (settings) {
        setSmtpSettings(settings.email_settings?.smtp || smtpSettings);
        setTemplates(settings.email_templates || []);
      }
    } catch (error) {
      console.error('Error fetching email settings:', error);
      setError('Erro ao carregar configurações de email');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        .from('configuracoes')
        .update({
          email_settings: { smtp: smtpSettings },
          email_templates: templates
        })
        .eq('user_id', user?.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving email settings:', error);
      setError('Erro ao salvar configurações de email');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: crypto.randomUUID(),
      name: 'Novo Template',
      subject: '',
      content: ''
    };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate.id);
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const updatedTemplates = templates.filter(t => t.id !== id);
      setTemplates(updatedTemplates);
      
      if (selectedTemplate === id) {
        setSelectedTemplate(updatedTemplates[0]?.id || null);
      }

      const { error } = await supabase
        .from('configuracoes')
        .update({ email_templates: updatedTemplates })
        .eq('user_id', user?.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting template:', error);
      setError('Erro ao excluir template');
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* SMTP Settings */}
      <div className={cardClass}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Configurações SMTP
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Host */}
          <div>
            <label className={labelClass}>Host SMTP</label>
            <div className="relative">
              <Server className={iconClass} />
              <input
                type="text"
                value={smtpSettings.host}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                className={inputClass}
                placeholder="smtp.exemplo.com"
              />
            </div>
          </div>

          {/* Port */}
          <div>
            <label className={labelClass}>Porta</label>
            <div className="relative">
              <Lock className={iconClass} />
              <input
                type="number"
                value={smtpSettings.port}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, port: parseInt(e.target.value) })}
                className={inputClass}
                placeholder="587"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className={labelClass}>Usuário</label>
            <div className="relative">
              <User className={iconClass} />
              <input
                type="text"
                value={smtpSettings.username}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, username: e.target.value })}
                className={inputClass}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={labelClass}>Senha</label>
            <div className="relative">
              <Lock className={iconClass} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={smtpSettings.password}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, password: e.target.value })}
                className={`${inputClass} pr-12`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* From Email */}
          <div>
            <label className={labelClass}>Email Remetente</label>
            <div className="relative">
              <Mail className={iconClass} />
              <input
                type="email"
                value={smtpSettings.from_email}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, from_email: e.target.value })}
                className={inputClass}
                placeholder="noreply@exemplo.com"
              />
            </div>
          </div>

          {/* From Name */}
          <div>
            <label className={labelClass}>Nome Remetente</label>
            <div className="relative">
              <User className={iconClass} />
              <input
                type="text"
                value={smtpSettings.from_name}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, from_name: e.target.value })}
                className={inputClass}
                placeholder="Sua Empresa"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className={cardClass}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Templates de Email
          </h2>
          <button
            onClick={handleAddTemplate}
            className="btn-primary flex items-center rounded-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Template
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Template List */}
          <div className="col-span-3 border-r border-light-border dark:border-gray-700/50 pr-6">
            <div className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === template.id
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                      : 'hover:bg-light-secondary dark:hover:bg-[#0F172A]/40'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <span className="truncate">{template.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTemplate(template.id);
                    }}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Template Editor */}
          <div className="col-span-9">
            {selectedTemplate ? (
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Nome do Template</label>
                  <input
                    type="text"
                    value={templates.find(t => t.id === selectedTemplate)?.name || ''}
                    onChange={(e) => {
                      const updatedTemplates = templates.map(t =>
                        t.id === selectedTemplate ? { ...t, name: e.target.value } : t
                      );
                      setTemplates(updatedTemplates);
                    }}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Assunto</label>
                  <input
                    type="text"
                    value={templates.find(t => t.id === selectedTemplate)?.subject || ''}
                    onChange={(e) => {
                      const updatedTemplates = templates.map(t =>
                        t.id === selectedTemplate ? { ...t, subject: e.target.value } : t
                      );
                      setTemplates(updatedTemplates);
                    }}
                    className={inputClass}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelClass}>Conteúdo</label>
                    <button
                      onClick={() => setPreviewMode(!previewMode)}
                      className="text-sm text-brand hover:text-brand/80"
                    >
                      {previewMode ? 'Editar' : 'Visualizar'}
                    </button>
                  </div>
                  {previewMode ? (
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none p-4 bg-white dark:bg-gray-800 rounded-lg border border-light-border dark:border-gray-700/50"
                      dangerouslySetInnerHTML={{
                        __html: templates.find(t => t.id === selectedTemplate)?.content || ''
                      }}
                    />
                  ) : (
                    <textarea
                      value={templates.find(t => t.id === selectedTemplate)?.content || ''}
                      onChange={(e) => {
                        const updatedTemplates = templates.map(t =>
                          t.id === selectedTemplate ? { ...t, content: e.target.value } : t
                        );
                        setTemplates(updatedTemplates);
                      }}
                      className={`${inputClass} h-96 font-mono`}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Selecione um template para editar
              </div>
            )}
          </div>
        </div>
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