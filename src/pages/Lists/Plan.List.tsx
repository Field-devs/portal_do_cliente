import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import {
  Plus,
  Search,
  Filter,
  Package,
  PlusSquare,
  HeadphonesIcon,
  Layout,
  Phone
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Plan from '../../Models/Plan';
import PlanAddon from '../../Models/Plan.Addon';
import { ModalForm } from '../../components/Modal/Modal';
import PlanForm from '../Forms/PlanForm';
import AddonForm from '../Forms/AddonForm';
import ActionsButtons from '../../components/ActionsData';
import { UpdateSingleField } from '../../utils/supageneric';
import CircularWait from '../../components/CircularWait';

type ContentType = 'plans' | 'addons';

export default function PlanList() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [addons, setAddons] = useState<PlanAddon[]>([]);
  const [addon, setAddon] = useState<PlanAddon | null>(null);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ContentType>('plans');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showAddonForm, setShowAddonForm] = useState(false);

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";
  const tabClass = (active: boolean) => `flex items-center px-4 py-2 rounded-lg transition-colors ${active
      ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
      : 'text-gray-600 dark:text-gray-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 hover:text-brand-600 dark:hover:text-brand-400'
    }`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: plansData, error: plansError } = await supabase
        .from('plano')
        .select('*')
        .eq('user_id', user?.id)
        .order('dt_add', { ascending: false });

        if (plansError) throw plansError;

      const { data: addonsData, error: addonsError } = await supabase
        .from('plano_addon')
        .select('*')
        .eq('user_id', user?.id)
        .order('dt_add', { ascending: false });

      if (addonsError) throw addonsError;

      setPlans(plansData || []);
      setAddons(addonsData || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    if (activeTab === 'plans') {
      const selectedPlan = plans.find(plan => plan.id = id);
      console.log(id)
      if (selectedPlan) {
        setPlan(selectedPlan);
        setShowPlanForm(true);
      }
    } else if (activeTab === 'addons') {
      const selectedAddon = addons.find(addon => addon.id === id);
      if (selectedAddon) {
        setAddon(selectedAddon);
        setShowAddonForm(true);
      }
    }
  };

  const handleNewClick = () => {
    if (activeTab === 'plans') {
      handleNewPlan();
    } else if (activeTab === 'addons') {
      handleNewAddOn()
    }
  };

  const handleNewPlan = () => {
    setPlan(null);
    setShowPlanForm(true);
  }

  const handleNewAddOn = () => {
    setAddon(null);
    setShowAddonForm(true)
  }

  const handleFormSuccess = () => {
    fetchData();
    setShowPlanForm(false);
    setShowAddonForm(false);
  };

  const handleOnLock = async (id: string, status: boolean) : Promise<boolean> => {
    if (activeTab === 'plans') {
      await UpdateSingleField("plano", "id", id, "active", !status);
    } else if (activeTab === 'addons') {
      await UpdateSingleField("plano_addon", "id", id, "active", !status);
    }
    return true;
  };

  const filteredPlans = plans.filter(plan =>
    plan.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || 
    (statusFilter === 'active' && plan.active) || 
    (statusFilter === 'inactive' && !plan.active))
  );

  const filteredAddons = addons.filter(addon =>
    addon.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || 
    (statusFilter === 'active' && addon.active) || 
    (statusFilter === 'inactive' && !addon.active))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularWait message="Planos e Addons" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className={titleClass}>{activeTab == "plans" ? "Lista de Planos" : "Lista de Addons" }</h1>
        <div className="flex space-x-3">
          <button
            // onClick={() =>  setShowPlanForm(true)}
            onClick={() => handleNewClick()}
            className="btn-primary flex items-center rounded-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            {activeTab == "plans" ? "Novo Plano" : "Novo Add-on"}
          </button>
        </div>
      </div>

      {/* Forms */}
      <ModalForm
        isOpen={showPlanForm}
        onClose={() => setShowPlanForm(false)}
        title={plan ? `Editar Plano: ${plan?.nome}` : 'Novo Plano'}
        maxWidth="2xl"
      >
        <PlanForm
          onSuccess={handleFormSuccess}
          onCancel={() => setShowPlanForm(false)}
          initialData={plan}
        />
      </ModalForm>

      <ModalForm
        isOpen={showAddonForm}
        onClose={() => setShowAddonForm(false)}
        title={addon ? `Editar Addon: ${addon?.nome}` : 'Novo Addon'}
        maxWidth="2xl"
      >
        <AddonForm
          onSuccess={handleFormSuccess}
          onCancel={() => setShowAddonForm(false)}
          initialData={addon}
        />
      </ModalForm>

      {/* Search and Tabs */}
      <div className={cardClass}>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors appearance-none min-w-[200px] rounded-lg shadow-sm"
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('plans')}
              className={tabClass(activeTab === 'plans')}
            >
              <Package className="h-5 w-5 mr-2" />
              Planos
            </button>
            <button
              onClick={() => setActiveTab('addons')}
              className={tabClass(activeTab === 'addons')}
            >
              <PlusSquare className="h-5 w-5 mr-2" />
              Add-ons
            </button>
          </div
          >
        </div>
      </div>

      {/* Content */}
      <div className={`${cardClass} mt-6 overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-light-border dark:divide-gray-700/50 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-light-secondary dark:bg-[#0F172A]/60 rounded-t-lg">
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[20px]">
                  Recursos
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[20px]">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[20px]">
                  Data de Criação
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider w-[50px]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-border dark:divide-gray-700/50">
              {(activeTab === 'plans' ? filteredPlans : filteredAddons).map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-light-secondary dark:hover:bg-[#0F172A]/40 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-medium text-light-text-primary dark:text-gray-100">
                      {item.nome}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      {'suporte_humano' in item && item.suporte_humano && (
                        <HeadphonesIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                      )}
                      {'kanban' in item && item.kanban && (
                        <Layout className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                      )}
                      {'whatsapp_oficial' in item && item.whatsapp_oficial && (
                        <Phone className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-right text-light-text-secondary dark:text-gray-300">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(item.valor)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base text-light-text-secondary dark:text-gray-300">
                      {new Date(item.dt_add).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <ActionsButtons 
                        onEdit={() => handleEdit(item.id)}
                        onLocker={async () => handleOnLock(item.id, item.active)}
                        active={item.active}
                      />
                    </div>
                  </td>

                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}