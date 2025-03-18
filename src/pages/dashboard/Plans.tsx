import { useState } from 'react';
import { Edit, Check, X, AlertTriangle, Package, PlusSquare } from 'lucide-react';

type ContentType = 'plans' | 'addons';
type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  features: {
    inboxes: number;
    keepCurrentInboxes: boolean;
    agents: number;
    automations: number;
    kanban: boolean;
  };
};

const defaultPlans: Plan[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Para pequenas empresas',
    price: 99.90,
    features: {
      inboxes: 1,
      keepCurrentInboxes: false,
      agents: 3,
      automations: 5,
      kanban: false
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Para empresas em crescimento',
    price: 199.90,
    features: {
      inboxes: 3,
      keepCurrentInboxes: false,
      agents: 10,
      automations: 15,
      kanban: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para grandes empresas',
    price: 399.90,
    features: {
      inboxes: 10,
      keepCurrentInboxes: false,
      agents: 30,
      automations: 50,
      kanban: true
    }
  }
];

type Addon = {
  addon_id: string;
  name: string;
  description: string;
  type: 'inbox' | 'agent' | 'automation' | 'kanban';
  price: number;
  value: number | boolean;
};

const defaultAddons: Addon[] = [
  {
    id: 'extra-inbox',
    name: 'Caixa de Entrada Adicional',
    description: 'Adicione mais caixas de entrada ao seu plano',
    type: 'inbox',
    price: 49.90,
    value: 1
  },
  {
    id: 'extra-agent',
    name: 'Atendente Adicional',
    description: 'Adicione mais atendentes ao seu plano',
    type: 'agent',
    price: 29.90,
    value: 1
  },
  {
    id: 'extra-automation',
    name: 'Automação Adicional',
    description: 'Adicione mais automações ao seu plano',
    type: 'automation',
    price: 19.90,
    value: 1
  },
  {
    id: 'kanban',
    name: 'Kanban',
    description: 'Adicione funcionalidade Kanban',
    type: 'kanban',
    price: 79.90,
    value: true
  }
];

export default function Plans() {
  const [activeContent, setActiveContent] = useState<ContentType>('plans');
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [showPriceConfirmation, setShowPriceConfirmation] = useState(false);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [plans, setPlans] = useState(defaultPlans);
  const [addons, setAddons] = useState(defaultAddons);

  // Consistent class names using Tailwind config
  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";
  const metricTitleClass = "text-lg font-medium text-light-text-primary dark:text-white mb-1";
  const metricValueClass = "text-3xl font-bold text-light-text-primary dark:text-white";
  const metricSubtextClass = "text-sm text-light-text-secondary dark:text-blue-200";
  const iconContainerClass = "bg-blue-400/10 p-3 rounded-lg";
  const iconClass = "h-6 w-6 text-blue-600 dark:text-blue-400";
  const badgeClass = "text-xs font-medium bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg";
  const tabClass = (active: boolean) => `flex items-center px-4 py-2 rounded-lg transition-colors ${active
    ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
    : 'text-gray-600 dark:text-gray-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 hover:text-brand-600 dark:hover:text-brand-400'
  }`;

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setOriginalPrice(plan.price);
  };

  const handleSavePlan = () => {
    if (editingPlan) {
      if (editingPlan.price !== originalPrice) {
        setShowPriceConfirmation(true);
      } else {
        confirmSavePlan();
      }
    }
  };

  const confirmSavePlan = () => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p));
      setEditingPlan(null);
      setShowPriceConfirmation(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setEditingAddon(null);
    setShowPriceConfirmation(false);
  };

  const handleEditAddon = (addon: Addon) => {
    setEditingAddon(addon);
  };

  const handleSaveAddon = () => {
    if (editingAddon) {
      setAddons(addons.map(a => a.id === editingAddon.addon_id ? editingAddon : a));
      setEditingAddon(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className={titleClass}>Planos e Add-ons</h1>
      </div>

      {/* Tabs */}
      <div className={cardClass}>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveContent('plans')}
            className={tabClass(activeContent === 'plans')}
          >
            <Package className="h-5 w-5 mr-2" />
            Planos
          </button>
          <button
            onClick={() => setActiveContent('addons')}
            className={tabClass(activeContent === 'addons')}
          >
            <PlusSquare className="h-5 w-5 mr-2" />
            Add-ons
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeContent === 'plans' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className={cardClass}>
                <div className="p-6 bg-brand text-white rounded-t-lg">
                  {editingPlan?.id === plan.id ? (
                    <>
                      <input
                        type="text"
                        value={editingPlan.name}
                        onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                        className="w-full text-xl font-bold bg-transparent border-b border-white/30 focus:border-white outline-none mb-2"
                      />
                      <input
                        type="number"
                        value={editingPlan.price}
                        onChange={(e) => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})}
                        className="w-full text-3xl font-bold bg-transparent border-b border-white/30 focus:border-white outline-none"
                      />
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-center mb-2">{plan.name}</h2>
                      <div className="text-center">
                        <span className="text-3xl font-bold">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(plan.price)}
                        </span>
                        <span className="text-sm">/mês</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6">
                  {editingPlan?.id === plan.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Caixas de Entrada
                        </label>
                        <div className="mt-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={editingPlan.features.inboxes}
                              onChange={(e) => setEditingPlan({
                                ...editingPlan,
                                features: {
                                  ...editingPlan.features,
                                  inboxes: parseInt(e.target.value)
                                }
                              })}
                              className="input"
                              min="0"
                              max="999"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={editingPlan.features.keepCurrentInboxes}
                              onChange={(e) => setEditingPlan({
                                ...editingPlan,
                                features: {
                                  ...editingPlan.features,
                                  keepCurrentInboxes: e.target.checked
                                }
                              })}
                              className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                            />
                            <label className="text-sm text-gray-600 dark:text-gray-400">
                              Manter tamanho atual das caixas
                            </label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Atendentes
                        </label>
                        <input
                          type="number"
                          value={editingPlan.features.agents}
                          onChange={(e) => setEditingPlan({
                            ...editingPlan,
                            features: {
                              ...editingPlan.features,
                              agents: parseInt(e.target.value)
                            }
                          })}
                          className="input"
                          min="0"
                          max="999"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Automações
                        </label>
                        <input
                          type="number"
                          value={editingPlan.features.automations}
                          onChange={(e) => setEditingPlan({
                            ...editingPlan,
                            features: {
                              ...editingPlan.features,
                              automations: parseInt(e.target.value)
                            }
                          })}
                          className="input"
                          min="0"
                          max="999"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Kanban
                        </label>
                        <select
                          value={editingPlan.features.kanban.toString()}
                          onChange={(e) => setEditingPlan({
                            ...editingPlan,
                            features: {
                              ...editingPlan.features,
                              kanban: e.target.value === 'true'
                            }
                          })}
                          className="select"
                        >
                          <option value="true">Sim</option>
                          <option value="false">Não</option>
                        </select>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleSavePlan}
                          className="btn-primary"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn-secondary"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400">{plan.features.inboxes}</span>
                          <span className="ml-2">Caixa(s) de Entrada</span>
                        </li>
                        {plan.features.keepCurrentInboxes && (
                          <li className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Mantém o tamanho atual das caixas
                          </li>
                        )}
                        <li className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400">{plan.features.agents}</span>
                          <span className="ml-2">Atendentes</span>
                        </li>
                        <li className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400">{plan.features.automations}</span>
                          <span className="ml-2">Automações</span>
                        </li>
                        <li className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            {plan.features.kanban ? 'Sim' : 'Não'}
                          </span>
                          <span className="ml-2">Kanban</span>
                        </li>
                      </ul>
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="btn-secondary w-full"
                      >
                        <Edit className="h-4 w-4 inline-block mr-2" />
                        Editar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addons.map((addon) => (
              <div key={addon.addon_id} className={cardClass}>
                <div className="p-6 bg-brand text-white rounded-t-lg">
                  {editingAddon?.id === addon.addon_id ? (
                    <>
                      <input
                        type="text"
                        value={editingAddon.name}
                        onChange={(e) => setEditingAddon({...editingAddon, name: e.target.value})}
                        className="w-full text-xl font-bold bg-transparent border-b border-white/30 focus:border-white outline-none mb-2"
                      />
                      <input
                        type="number"
                        value={editingAddon.price}
                        onChange={(e) => setEditingAddon({...editingAddon, price: parseFloat(e.target.value)})}
                        className="w-full text-3xl font-bold bg-transparent border-b border-white/30 focus:border-white outline-none"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-center mb-2">{addon.name}</h3>
                      <div className="text-center">
                        <span className="text-3xl font-bold">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(addon.price)}
                        </span>
                        <span className="text-sm">/unidade</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6">
                  {editingAddon?.id === addon.addon_id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Valor
                        </label>
                        {addon.type === 'kanban' ? (
                          <select
                            value={editingAddon.value.toString()}
                            onChange={(e) => setEditingAddon({
                              ...editingAddon,
                              value: e.target.value === 'true'
                            })}
                            className="select"
                          >
                            <option value="true">Sim</option>
                            <option value="false">Não</option>
                          </select>
                        ) : (
                          <input
                            type="number"
                            value={editingAddon.value as number}
                            onChange={(e) => setEditingAddon({
                              ...editingAddon,
                              value: parseInt(e.target.value)
                            })}
                            className="input"
                            min="0"
                            max="999"
                          />
                        )}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleSaveAddon}
                          className="btn-primary"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn-secondary"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">{addon.description}</p>
                      <button
                        onClick={() => handleEditAddon(addon)}
                        className="btn-secondary w-full"
                      >
                        <Edit className="h-4 w-4 inline-block mr-2" />
                        Editar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Change Confirmation Modal */}
      {showPriceConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${cardClass} max-w-md w-full mx-4`}>
            <div className="flex items-center text-yellow-600 mb-4">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Confirmar alteração de preço</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Você está alterando o valor do plano de{' '}
              <span className="font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(originalPrice)}
              </span>{' '}
              para{' '}
              <span className="font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(editingPlan?.price || 0)}
              </span>
              . Deseja continuar?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelEdit}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSavePlan}
                className="btn-primary"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}