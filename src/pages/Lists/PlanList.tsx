import { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthProvider';
import {
  Plus,
  Search,
  Trash2,
  AlertCircle,
  Package,
  PlusSquare,
  HeadphonesIcon,
  Layout,
  Phone,
  X,
  Edit
} from 'lucide-react';


import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import PlanForm from '../../components/PlanForm';
import AddonForm from '../Forms/AddonForm';
import Plan from '../../Models/Plan';
import PlanAddon from '../../Models/Plan.Addon';

type ContentType = 'plans' | 'addons';

export default function PlanList() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const [addons, setAddons] = useState<PlanAddon[]>([]);
  const [editingAddon, seteditingAddon] = useState<PlanAddon | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; nome: string; type: ContentType } | null>(null);
  const [activeForm, setActiveForm] = useState<'plan' | 'addon'>('plan');
  const [activeTab, setActiveTab] = useState<ContentType>('plans');


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch plans
      const { data: plansData, error: plansError } = await supabase
        .from('plano')
        .select('*')
        .eq('active', true)
        .eq('user_id', user?.id)
        .order('dt_add', { ascending: false });

      if (plansError) throw plansError;

      // Fetch addons
      const { data: addonsData, error: addonsError } = await supabase
        .from('plano_addon')
        .select('*')
        .eq('active', true)
        .eq('user_id', user?.id)
        .order('dt_add', { ascending: false });

      if (addonsError) throw addonsError;

      setPlans(plansData || []);
      setAddons(addonsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setActiveForm('plan');
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      const table = selectedItem.type === 'plans' ? 'plano_outr' : 'addon';
      const idField = selectedItem.type === 'plans' ? 'plano_outr_id' : 'addon_id';

      const { error } = await supabase
        .from(table)
        .update({ status: false })
        .eq(idField, selectedItem.id);

      if (error) throw error;

      if (selectedItem.type === 'plans') {
        setPlans(prev => prev.filter(p => p.id !== selectedItem.id));
      } else {
        setAddons(prev => prev.filter(a => a.addon_id !== selectedItem.id));
      }

      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Erro ao excluir item');
    }
  };

  const filteredPlans = plans.filter(plan =>
    plan.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAddons = addons.filter(addon =>
    addon.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Search and Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Produtos</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setActiveForm('plan');
              setEditingPlan(null);
              setIsFormOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Plano
          </button>
          <button
            onClick={() => {
              setActiveForm('addon');
              setEditingPlan(null);
              setIsFormOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Add-on
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center pb-4 px-1 ${activeTab === 'plans'
              ? 'border-b-2 border-brand text-brand dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <Package className="h-5 w-5 mr-2" />
            Planos
          </button>
          <button
            onClick={() => setActiveTab('addons')}
            className={`flex items-center pb-4 px-1 ${activeTab === 'addons'
              ? 'border-b-2 border-brand text-brand dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <PlusSquare className="h-5 w-5 mr-2" />
            Add-ons
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider w-[50px]">
                  Recursos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider w-[50px]">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider w-[50px]">
                  Data de Criação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider w-[50px]">
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {activeTab === 'plans' ? (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                        {plan.nome}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {plan.suporte_humano == true && (
                          <HeadphonesIcon className="h-5 w-5 text-gray-400" />
                        )}
                        {plan.kanban == true && (
                          <Layout className="h-5 w-5 text-gray-400" />
                        )}
                        {plan.whatsapp_oficial == true && (
                          <Phone className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </td>


                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-text-primary">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(plan.valor)}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-dark-text-muted">
                        {format(new Date(plan.dt_add), 'dd/MM/yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          className="group p-2 rounded-lg transition-all duration-200 hover:bg-orange-100 dark:hover:bg-orange-900/20 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-500/60 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                          onClick={() => handleEdit(plan)}
                        >
                          <Edit className="h-5 w-5 text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem({ id: plan.id, nome: plan.nome, type: 'plans' });
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredAddons.map((addon) => (
                  <tr key={addon.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                        {addon.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-text-primary">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(addon.valor)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-dark-text-muted">
                        {format(new Date(addon.dt_add), 'dd/MM/yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          className="group p-2 rounded-lg transition-all duration-200 hover:bg-orange-100 dark:hover:bg-orange-900/20 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-500/60 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                          onClick={() => {
                            setEditingPlan(addon);
                            setActiveForm('addon');
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="h-5 w-5 text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem({ id: addon.id, nome: addon.nome, type: 'addons' });
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary">
                {editingPlan ? 'Editar Plano' : activeForm === 'plan' ? 'Novo Plano' : 'Novo Add-on'}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingPlan(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {activeForm === 'plan' ? (
              <PlanForm
                onSuccess={() => {
                  setIsFormOpen(false);
                  setEditingPlan(null);
                  fetchData();
                }}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingPlan(null);
                }}
                initialData={editingPlan}
              />
            ) : (
              <AddonForm
                onSuccess={() => {
                  setIsFormOpen(false);
                  fetchData();
                }}
                onCancel={() => setIsFormOpen(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center text-red-600 mb-4">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Confirmar exclusão</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tem certeza que deseja excluir {selectedItem.type === 'plans' ? 'o plano' : 'o add-on'} "{selectedItem.nome}"?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}