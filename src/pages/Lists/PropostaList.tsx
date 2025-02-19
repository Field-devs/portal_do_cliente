import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, X, AlertTriangle, Loader2, Check } from 'lucide-react';
import { usePlanos } from '../../hooks/usePlanos';
import { useAddons } from '../../hooks/useAddons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';

interface Proposta {
  proposta_id: string;
  dt_inicio: string;
  dt_fim: string | null;
  valor: number;
  status: boolean;
  cliente_final_cliente_final_id: string;
  ava_ava_id: string;
  plano_outr_plano_outr_id: string;
  addon_outr_addon_outr_id: string;
  addon_id: string;
  email_empresa: string;
  email_empresarial: string;
  nome_empresa: string;
  cnpj: string;
  responsavel: string;
  cpf: string;
  telefone: string;
  wallet_id: string;
}

export default function Proposals() {
  const { planos, loading: planosLoading } = usePlanos();
  const { addons, loading: addonsLoading } = useAddons();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [proposals, setProposals] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cnpj: '',
    responsavel: '',
    cnpjcpf: '',
    fone: '',

    caixas_entrada: 1,
    atendentes: 1,
    automacoes: 1,

    planoId: '0',
    walletId: '',
    selectedAddons: [] as string[]
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  // Calculate total value when plan or addons change
  useEffect(() => {
    let total = 0;
    const selectedPlan = planos.find(p => p.id === formData.planoId);
    if (selectedPlan) {
      total += selectedPlan.valor;
    }

    selectedAddons.forEach(addonId => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) {
        total += addon.valor;
      }
    });

    setTotalValue(total);
  }, [formData.planoId, selectedAddons, planos, addons]);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('proposta')
        .select('*')
        //.eq('user_id', user?.id)
        .eq('user_id', 1)
        .order('datetime', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProposalId) return;

    try {
      const { error } = await supabase
        .from('PROPOSTA_OUTR')
        .delete()
        .eq('proposta_id', selectedProposalId);

      if (error) throw error;

      setProposals(prev => prev.filter(p => p.proposta_id !== selectedProposalId));
      setIsDeleteModalOpen(false);
      setSelectedProposalId(null);
    } catch (error) {
      console.error('Error deleting proposal:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => {
      if (prev.includes(addonId)) {
        return prev.filter(id => id !== addonId);
      } else {
        return [...prev, addonId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const selectedPlan = planos.find(p => p.plano_outr_id === formData.planoId);
      if (!selectedPlan) throw new Error('Plano não selecionado');

      const proposal = {
        cliente_final_cliente_final_id: user?.id,
        plano_outr_plano_outr_id: formData.planoId,
        email_empresa: formData.email,
        email_empresarial: formData.emailEmpresarial,
        wallet_id: formData.walletId,
        nome_empresa: formData.nome,
        cnpj: formData.cnpj,
        responsavel: formData.responsavel,
        cpf: formData.cpf,
        telefone: formData.telefone,
        valor: totalValue,
        addon_id: selectedAddons[0] || null, // For now, just use the first selected addon
        addon_outr_addon_outr_id: selectedAddons[0] || null,
        ava_ava_id: user?.id // Temporary, should be properly set
      };

      const { data, error } = await supabase
        .from('PROPOSTA_OUTR')
        .insert([proposal])
        .select()
        .single();

      if (error) throw error;

      setProposals(prev => [data, ...prev]);
      setIsFormOpen(false);
      setFormData({
        nome: '',
        email: '',
        emailEmpresarial: '',
        walletId: '',
        cnpj: '',
        responsavel: '',
        cpf: '',
        telefone: '',
        planoId: '',
        selectedAddons: []
      });
      setSelectedAddons([]);
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  if (loading || planosLoading || addonsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Propostas</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Proposta
        </button>
      </div>

      {/* Proposals Table */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {proposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma proposta encontrada
                  </td>
                </tr>
              ) : (
                proposals.map((proposal) => (
                  <tr key={proposal.proposta_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {proposal.nome_empresa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {planos.find(p => p.plano_outr_id === proposal.plano_outr_plano_outr_id)?.nome || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(proposal.valor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${proposal.status
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                        {proposal.status ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(proposal.dt_inicio).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button className="text-brand hover:text-brand/80">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-brand hover:text-brand/80">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProposalId(proposal.proposta_id);
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

      {/* New Proposal Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Nova Proposta</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informações da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nome da Empresa
                    </label>
                    <input
                      type="text"
                      name="nomeEmpresa"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email da Empresa
                    </label>
                    <input
                      type="email"
                      name="emailEmpresa"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Empresarial
                    </label>
                    <input
                      type="email"
                      name="emailEmpresarial"
                      value={formData.emailEmpresarial}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Wallet ID
                    </label>
                    <input
                      type="text"
                      name="walletId"
                      value={formData.walletId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Responsible Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informações do Responsável</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nome do Responsável
                    </label>
                    <input
                      type="text"
                      name="responsavel"
                      value={formData.responsavel}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      CPF
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Plano</h3>
                <div className="grid grid-cols-1 gap-4">
                  {planos.map(plano => (
                    <div key={plano.plano_outr_id} className="border rounded-lg p-4 dark:border-gray-600">
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="planoId"
                          value={plano.plano_outr_id}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-brand focus:ring-brand"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{plano.nome}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{plano.descricao}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              • {plano.caixas_entrada} Caixa(s) de Entrada
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              • {plano.atendentes} Atendentes
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              • {plano.automacoes} Automações
                            </p>
                            {plano.kanban && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                • Kanban Incluído
                              </p>
                            )}
                          </div>
                          <p className="mt-2 text-lg font-medium text-brand">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(plano.valor)}
                            <span className="text-sm text-gray-500">/mês</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Addons Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add-ons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addons.map(addon => (
                    <div key={addon.addon_id} className="border rounded-lg p-4 dark:border-gray-600">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes(addon.addon_id)}
                          onChange={() => handleAddonToggle(addon.addon_id)}
                          className="h-4 w-4 text-brand focus:ring-brand rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{addon.nome}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{addon.descricao}</p>
                          <p className="mt-1 text-brand font-medium">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(addon.valor)}
                            <span className="text-sm text-gray-500">/mês</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Value */}
              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">Valor Total:</p>
                  <p className="text-2xl font-bold text-brand">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(totalValue)}
                    <span className="text-sm text-gray-500">/mês</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90"
                >
                  Criar Proposta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Confirmar exclusão</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tem certeza que deseja excluir esta proposta? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedProposalId(null);
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