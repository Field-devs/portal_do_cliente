import React, { useState, useEffect } from 'react';
import {
  Mail,
  Palette,
  FileText,
  Lock,
  History,
  Save,
  AlertCircle,
  Loader2,
  Eye,
  Upload,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';
import '../../Styles/animations.css';
import CircularWait from '../../components/CircularWait';
import { UserRoles } from '../../utils/consts';
import EmailSettings from './EmailSettings';
import BrandingSettings from './BrandingSettings';
import TermsSettings from './TermsSettings';

interface SettingsTab {
  id: string;
  name: string;
  icon: React.ElementType;
  component: React.ComponentType;
  roles: UserRoles[];
}

export default function AdminSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('email');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";
  const tabClass = (active: boolean) => `flex items-center px-4 py-2 rounded-lg transition-colors ${
    active
      ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
      : 'text-gray-600 dark:text-gray-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 hover:text-brand-600 dark:hover:text-brand-400'
  }`;

  const tabs: SettingsTab[] = [
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      component: EmailSettings,
      roles: [UserRoles.SUPER_ADMIN, UserRoles.ADMIN, UserRoles.AVA_ADMIN]
    },
    {
      id: 'branding',
      name: 'Identidade Visual',
      icon: Palette,
      component: BrandingSettings,
      roles: [UserRoles.AVA_ADMIN, UserRoles.AVA]
    },
    {
      id: 'terms',
      name: 'Termos de Adesão',
      icon: FileText,
      component: TermsSettings,
      roles: [UserRoles.AVA_ADMIN, UserRoles.AVA]
    }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Fetch settings from Supabase
      const { data: settings, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      // Initialize settings if they don't exist
      if (!settings) {
        await supabase.from('configuracoes').insert([{
          user_id: user?.id,
          email_settings: {},
          branding_settings: {},
          terms_settings: {}
        }]);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Save settings logic here
      // This will be implemented in each settings component
      
      setSaving(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Erro ao salvar configurações');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularWait message="Configurações" />
      </div>
    );
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`${titleClass} title-fade-in`}>Configurações</h1>
      </div>

      <div className="flex space-x-6">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0 fade-in">
          <div className={cardClass}>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                if (!tab.roles.includes(user?.perfil_cod as UserRoles)) return null;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={tabClass(activeTab === tab.id)}
                  >
                    <tab.icon className="h-5 w-5 mr-2" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 fade-in">
          {ActiveComponent && (
            <ActiveComponent />
          )}
        </div>
      </div>
    </div>
  );
}