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
import Contract from '../../Models/Contract';

type ContentType = 'plans' | 'addons';

export default function ContractList() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);

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
      const { data: contractsData, error: plansError } = await supabase
        .from('v_contrato')
        .select('*');
        //.eq('active', true)
        //.eq('user_id', user?.id)
        //.order('dt_add', { ascending: false });

      if (plansError) throw plansError;


      setContracts(contractsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erro ao carregar contratos');
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter(contract =>
    contract.plano_nome.toLowerCase().includes(searchTerm.toLowerCase())
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


      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider w-[50px]">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider w-[10px]">
                  Fone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider w-[10px]">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider w-[10px]">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider w-[10px]">
                  Consumo
                </th>
              </tr>
            </thead>


            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {
                  filteredContracts.map((contract) => (
                    <tr key={contract.id } className="hover:bg-gray-50 dark:hover:bg-gray-700">

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                          {contract.nome}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                          {contract.fone}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                          {contract.email}
                        </div>
                      </td>


                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                          {contract.status_title}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                          
                        </div>
                      </td>

                    </tr>


))
                }
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