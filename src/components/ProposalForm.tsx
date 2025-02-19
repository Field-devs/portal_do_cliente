import React, { useState, useEffect } from 'react';
import { Plus, Edit2, FileText, FileSignature } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCNPJ, formatPhone, formatCurrency } from '../utils/formatters';
import { Link } from 'react-router-dom';
import { ModalForm } from '../components/Modal/Modal';

interface Plan {
  id: string;
  name: string;
  value: number;
  unit: string;
  accounts: number;
  inboxes: number;
  agents: number;
  automations: number;
  kanban: string;
}

interface Addon {
  id: string;
  name: string;
  value: number;
  unit: string;
  quantity: number;
}

interface Customer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  company: string;
  cnpj: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  plan_name: string | null;
  plan_value: number | null;
  inbox_count: number | null;
  agent_count: number | null;
  automation_count: number | null;
  has_human_support: boolean;
  status: 'pending_payment' | 'payment_confirmed' | 'payment_cancelled';
  role: string;
}

export function ProposalForm() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    company: '',
    cnpj: '',
    phone: '',
    address: '',
    desiredInboxes: 1,
    desiredAgents: 1,
    desiredAutomations: 1,
    addonIds: [] as string[]
  });
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [totalValue, setTotalValue] = useState(0);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [proposalVersion, setProposalVersion] = useState(1);

  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
        resetForm();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  useEffect(() => {
    Promise.all([
      fetchCustomers(),
      fetchPlansAndAddons()
    ]).catch(console.error);
  }, []);

  async function fetchPlansAndAddons() {
    try {
      const { data: plansData, error: plansError } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('value', { ascending: true });

      if (plansError) throw plansError;
      setPlans(plansData || []);

      const { data: addonsData, error: addonsError } = await supabase
        .from('addons')
        .select('*')
        .eq('is_active', true)
        .order('value', { ascending: true });

      if (addonsError) throw addonsError;
      setAddons(addonsData || []);
    } catch (error) {
      console.error('Error fetching plans and addons:', error);
    }
  }

  async function fetchCustomers() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session');
      }

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate appropriate plan based on desired quantities
  const calculatePlan = (inboxes: number, agents: number, automations: number, accountType: string = 'Cliente') => {
    // Sort plans by value ascending to get the lowest tier that fits
    const filteredPlans = plans.filter(plan => 
      plan.customer_type === (accountType === 'AVA' ? 'AVA' : 'Cliente Final')
    );
    const sortedPlans = [...filteredPlans].sort((a, b) => a.value - b.value);
    
    // Find the first plan that can accommodate the desired quantities
    const basePlan = sortedPlans.find(plan => 
      inboxes <= plan.inboxes && 
      agents <= plan.agents &&
      automations <= plan.automations
    ) || sortedPlans[sortedPlans.length - 1]; // Use highest plan if none fits
    
    // Automatically add human support for Enterprise plan
    const newAddonIds = [...newCustomer.addonIds];
    const supportAddon = addons.find(a => a.name === 'Suporte humano');
    const supportAddonId = 'human-support';
    
    if (basePlan.name === 'Enterprise' && supportAddon) {
      if (!newAddonIds.includes(supportAddonId)) {
        newAddonIds.push(supportAddonId);
      }
    } else if (supportAddon) {
      // Remove support addon if not Enterprise plan
      const index = newAddonIds.indexOf(supportAddonId);
      if (index > -1) {
        newAddonIds.splice(index, 1);
      }
    }
    
    // Calculate extra resources needed
    const extraInboxes = Math.max(0, inboxes - (basePlan?.inboxes || 0));
    const extraAgents = Math.max(0, agents - (basePlan?.agents || 0));
    const extraAutomations = Math.max(0, automations - (basePlan?.automations || 0));
    
    // Update add-ons based on extra resources
    const inboxAddon = addons.find(a => a.name === 'Caixas de entrada adicionais');
    const agentAddon = addons.find(a => a.name === 'Atendentes adicionais');
    const automationAddon = addons.find(a => a.name === 'Automações adicionais');
    
    if (extraInboxes > 0 && inboxAddon) {
      if (!newAddonIds.includes(inboxAddon.id)) {
        newAddonIds.push(inboxAddon.id);
      }
    }
    
    if (extraAgents > 0 && agentAddon) {
      if (!newAddonIds.includes(agentAddon.id)) {
        newAddonIds.push(agentAddon.id);
      }
    }
    
    if (extraAutomations > 0 && automationAddon) {
      if (!newAddonIds.includes(automationAddon.id)) {
        newAddonIds.push(automationAddon.id);
      }
    }
    
    // Update customer's addon IDs
    setNewCustomer(prev => ({
      ...prev,
      addonIds: newAddonIds
    }));
    
    return basePlan;
  };

  // Calculate total value including addons
  const calculateTotalValue = (plan: Plan | null, addonIds: string[], accountType: string = 'Cliente') => {
    let total = plan?.value || 0;

    if (!plan) return 0;

    const isEnterprise = plan?.name === 'Enterprise';
    const hasHumanSupport = addonIds.includes('human-support');

    // Get addon costs based on account type
    const inboxAddon = addons.find(a => a.name === 'Caixas de entrada adicionais' && a.customer_type === (accountType === 'AVA' ? 'AVA' : 'Cliente Final'));
    const agentAddon = addons.find(a => a.name === 'Atendentes adicionais' && a.customer_type === (accountType === 'AVA' ? 'AVA' : 'Cliente Final'));
    const automationAddon = addons.find(a => a.name === 'Automações adicionais' && a.customer_type === (accountType === 'AVA' ? 'AVA' : 'Cliente Final'));

    // Calculate extra resources needed
    const extraInboxes = Math.max(0, newCustomer.desiredInboxes - (plan?.inboxes || 0));
    const extraAgents = Math.max(0, newCustomer.desiredAgents - (plan?.agents || 0));
    const extraAutomations = Math.max(0, newCustomer.desiredAutomations - (plan?.automations || 0));

    // Calculate costs for extra resources using type-specific rates
    const extraInboxesCost = extraInboxes * (inboxAddon?.value || 50);
    const extraAgentsCost = extraAgents * (agentAddon?.value || 50);
    const extraAutomationsCost = extraAutomations * (automationAddon?.value || 25);
    
    total += extraInboxesCost + extraAgentsCost + extraAutomationsCost;

    // Add human support cost if selected and not Enterprise plan
    if (hasHumanSupport && !isEnterprise) {
      const supportAddon = addons.find(a => 
        a.name === 'Suporte humano' && 
        a.customer_type === (accountType === 'AVA' ? 'AVA' : 'Cliente Final')
      );
      total += supportAddon?.value || 525;
    }

    return total;
  };

  const handleSave = async (sendProposal: boolean = false) => {
    try {
      if (!selectedPlan) throw new Error('Selected plan not found');
      const isNewPaymentConfirmation = editingCustomer?.status !== 'payment_confirmed' && 
        editingCustomer?.status === 'pending_payment';

      const newVersion = editingCustomer ? proposalVersion + 1 : 1;

      const customerData = {
        name: newCustomer.name,
        email: newCustomer.email,
        company: newCustomer.company,
        cnpj: newCustomer.cnpj ? newCustomer.cnpj.replace(/\D/g, '') : null,
        phone: newCustomer.phone ? newCustomer.phone.replace(/\D/g, '') : null,
        address: newCustomer.address || null,
        status: editingCustomer?.status || 'pending_payment',
        role: 'standard',
        plan_name: selectedPlan.name,
        plan_value: totalValue, // Use calculated total value
        inbox_count: newCustomer.desiredInboxes,
        agent_count: newCustomer.desiredAgents,
        automation_count: newCustomer.desiredAutomations,
        proposal_version: newVersion
      };

      if (editingCustomer) {
        // Update existing customer
        const { error } = await supabase
          .from('customers').update({
            ...customerData,
            // If payment is being confirmed for the first time, update role to standard
            role: isNewPaymentConfirmation ? 'standard' : customerData.role
          })
          .eq('user_id', editingCustomer.user_id)
          .select()
          .single();

        if (error) throw error;

        // If payment was just confirmed, show success message
        if (isNewPaymentConfirmation) {
          alert('Proposta convertida em conta com sucesso!');
        }
      } else {
        // Create new customer
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: newCustomer.email,
          password: Math.random().toString(36).slice(-8),
          options: { data: { name: newCustomer.name } }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('No user returned from auth signup');

        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            ...customerData,
            user_id: authData.user.id
          });

        if (customerError) throw customerError;
      }

      if (sendProposal) {
        // Handle proposal sending logic here
        await handleGeneratePDF(editingCustomer || {
          ...customerData,
          id: '',
          user_id: '',
          created_at: new Date().toISOString(),
          has_human_support: selectedPlan.name === 'Enterprise'
        });
      }

      await fetchCustomers();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Erro ao salvar empresa');
    }
  };

  const resetForm = () => {
    setNewCustomer({
      name: '',
      email: '',
      company: '',
      cnpj: '',
      phone: '',
      address: '',
      desiredInboxes: 1,
      desiredAgents: 1,
      desiredAutomations: 1,
      addonIds: []
    });
    setSelectedPlan(null);
    setTotalValue(0);
    setEditingCustomer(null);
    setProposalVersion(1);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setNewCustomer({
      name: customer.name,
      email: customer.email,
      company: customer.company,
      cnpj: customer.cnpj || '',
      phone: customer.phone || '',
      address: customer.address || '',
      desiredInboxes: customer.inbox_count || 1,
      desiredAgents: customer.agent_count || 1,
      desiredAutomations: customer.automation_count || 1,
      addonIds: []
    });
    setProposalVersion(customer.proposal_version || 1);
    
    // Find and set the matching plan
    const matchingPlan = plans.find(p => p.name === customer.plan_name);
    if (matchingPlan) {
      setSelectedPlan(matchingPlan);
      setTotalValue(customer.plan_value || 0);
    }
    
    setIsModalOpen(true);
  };

  const handleGeneratePDF = async (customer: Customer) => {
    // TODO: Implement PDF generation
    console.log('Generating PDF for customer:', customer);
    alert('Funcionalidade de geração de PDF será implementada em breve');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gerenciamento de Propostas
        </h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Proposta
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Versão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <Link
                        to={`/customer/${customer.user_id}`}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {customer.company}
                      </Link>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.type === 'AVA'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {customer.type === 'AVA' ? 'Afiliado de Valor Agregado' : 'Cliente Final'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {customer.plan_name || 'Sem plano'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {customer.plan_value ? formatCurrency(customer.plan_value) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    V{customer.proposal_version || 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.status === 'payment_confirmed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : customer.status === 'payment_cancelled'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {customer.status === 'payment_confirmed'
                        ? 'Confirmado'
                        : customer.status === 'payment_cancelled'
                        ? 'Cancelado'
                        : 'Aguardando'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Editar proposta"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleGeneratePDF(customer)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        title="Gerar e enviar proposta"
                      >
                        <FileSignature className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ModalForm
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          maxWidth="4xl"
        >
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingCustomer ? `Editar Proposta (V${proposalVersion})` : 'Nova Proposta'}
              </h2>
            </div>

            <form className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomer.company}
                    onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomer.cnpj}
                    onChange={(e) => setNewCustomer({ ...newCustomer, cnpj: formatCNPJ(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Responsável
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: formatPhone(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Rua, número, complemento, bairro, cidade - UF"
                  />
                </div>
              </div>

              {/* Resource Requirements */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Recursos Necessários
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Caixas de Entrada
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newCustomer.desiredInboxes}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setNewCustomer({ ...newCustomer, desiredInboxes: value });
                        const plan = calculatePlan(value, newCustomer.desiredAgents, newCustomer.desiredAutomations);
                        setSelectedPlan(plan);
                        setTotalValue(calculateTotalValue(plan, newCustomer.addonIds));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Atendentes
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newCustomer.desiredAgents}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setNewCustomer({ ...newCustomer, desiredAgents: value });
                        const plan = calculatePlan(newCustomer.desiredInboxes, value, newCustomer.desiredAutomations);
                        setSelectedPlan(plan);
                        setTotalValue(calculateTotalValue(plan, newCustomer.addonIds));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Automações
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newCustomer.desiredAutomations}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setNewCustomer({ ...newCustomer, desiredAutomations: value });
                        const plan = calculatePlan(newCustomer.desiredInboxes, newCustomer.desiredAgents, value);
                        setSelectedPlan(plan);
                        setTotalValue(calculateTotalValue(plan, newCustomer.addonIds));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Plan Summary */}
              {selectedPlan && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Resumo da Proposta
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          Plano {selectedPlan.name}
                         <span className="ml-2 text-base font-normal text-gray-500 dark:text-gray-400">
                           ({formatCurrency(selectedPlan.value)}/mês)
                         </span>
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Recursos Inclusos:</p>
                            <ul className="mt-1 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                              <li>• {selectedPlan.inboxes} caixa{selectedPlan.inboxes > 1 ? 's' : ''} de entrada</li>
                              <li>• {selectedPlan.agents} atendente{selectedPlan.agents > 1 ? 's' : ''}</li>
                              <li>• {selectedPlan.automations} automação{selectedPlan.automations > 1 ? 'ões' : ''}</li>
                              <li>• Kanban {selectedPlan.kanban}</li>
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Recursos Adicionais:</p>
                            <ul className="mt-1 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                             {newCustomer.desiredInboxes > selectedPlan.inboxes ? (
                               <li className="flex justify-between items-center">
                                 <span>• {newCustomer.desiredInboxes - selectedPlan.inboxes} caixa(s) extra(s)</span>
                                 <span className="text-gray-500">
                                   (+{formatCurrency((newCustomer.desiredInboxes - selectedPlan.inboxes) * 50)}/mês)
                                 </span>
                               </li>
                             ) : null}
                             {newCustomer.desiredAgents > selectedPlan.agents ? (
                               <li className="flex justify-between items-center">
                                 <span>• {newCustomer.desiredAgents - selectedPlan.agents} atendente(s) extra(s)</span>
                                 <span className="text-gray-500">
                                   (+{formatCurrency((newCustomer.desiredAgents - selectedPlan.agents) * 50)}/mês)
                                 </span>
                               </li>
                             ) : null}
                             {newCustomer.desiredAutomations > selectedPlan.automations ? (
                               <li className="flex justify-between items-center">
                                 <span>• {newCustomer.desiredAutomations - selectedPlan.automations} automação(ões) extra(s)</span>
                                 <span className="text-gray-500">
                                   (+{formatCurrency((newCustomer.desiredAutomations - selectedPlan.automations) * 25)}/mês)
                                 </span>
                               </li>
                             ) : null}
                            </ul>
                           {(newCustomer.desiredInboxes > selectedPlan.inboxes ||
                             newCustomer.desiredAgents > selectedPlan.agents ||
                             newCustomer.desiredAutomations > selectedPlan.automations) && (
                             <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                               <div className="flex justify-between items-center text-sm">
                                 <span className="font-medium text-gray-700 dark:text-gray-300">
                                  Subtotal recursos adicionais:
                                 </span>
                                 <span className="text-gray-500">
                                  +{formatCurrency(
                                    Math.max(0, (newCustomer.desiredInboxes - selectedPlan.inboxes) * 50) +
                                    Math.max(0, (newCustomer.desiredAgents - selectedPlan.agents) * 50) +
                                    Math.max(0, (newCustomer.desiredAutomations - selectedPlan.automations) * 25)
                                  )}/mês
                                 </span>
                               </div>
                             </div>
                           )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={newCustomer.addonIds.includes('human-support')}
                              onChange={(e) => {
                                const newAddonIds = e.target.checked
                                  ? [...newCustomer.addonIds, 'human-support'] 
                                  : newCustomer.addonIds.filter(id => id !== 'human-support'); 
                                setNewCustomer({ ...newCustomer, addonIds: newAddonIds });
                                setTotalValue(calculateTotalValue(selectedPlan, newAddonIds));
                              }}
                              checked={selectedPlan.name === 'Enterprise' || newCustomer.addonIds.includes('human-support')}
                              disabled={selectedPlan.name === 'Enterprise'} 
                              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Suporte Humano
                              {selectedPlan.name === 'Enterprise' && ' (Incluso)'}
                            </span>
                          </label>
                          {newCustomer.addonIds.includes('human-support') && selectedPlan.name !== 'Enterprise' && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              (+{formatCurrency(525)}/mês)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between items-center">
                         <div>
                           <p className="text-lg font-semibold text-gray-900 dark:text-white">Valor Total</p>
                           <p className="text-sm text-gray-500 dark:text-gray-400">
                             Plano + Recursos Adicionais {newCustomer.addonIds.includes('human-support') && selectedPlan.name !== 'Enterprise' && '+ Suporte Humano'}
                           </p>
                         </div>
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(totalValue)}/mês
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {editingCustomer && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status do Pagamento
                    </label>
                    <select
                      value={editingCustomer.status}
                      onChange={(e) => setEditingCustomer({
                        ...editingCustomer,
                        status: e.target.value as 'pending_payment' | 'payment_confirmed'
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="pending_payment">Aguardando</option>
                      <option value="payment_confirmed">Confirmado</option>
                      <option value="payment_cancelled">Cancelado</option>
                    </select>
                    {editingCustomer.status === 'pending_payment' && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Ao confirmar o pagamento, a proposta será convertida em conta automaticamente.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Salvar e Enviar
                </button>
              </div>
            </form>
        </ModalForm>
      )}
    </div>
  );
}