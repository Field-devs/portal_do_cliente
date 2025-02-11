import React, { useState } from 'react';
import { Edit, Check, X, Plus, AlertTriangle, Package, PlusSquare } from 'lucide-react';

// ... (rest of the imports and interfaces remain the same)

export default function Plans() {
  // ... (state and handlers remain the same)

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveContent('plans')}
            className={`flex items-center pb-4 px-1 ${
              activeContent === 'plans'
                ? 'border-b-2 border-[#07152E] dark:border-blue-500 text-[#07152E] dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Package className="h-5 w-5 mr-2" />
            Planos
          </button>
          <button
            onClick={() => setActiveContent('addons')}
            className={`flex items-center pb-4 px-1 ${
              activeContent === 'addons'
                ? 'border-b-2 border-[#07152E] dark:border-blue-500 text-[#07152E] dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <PlusSquare className="h-5 w-5 mr-2" />
            Add-ons
          </button>
        </div>
      </div>

      {activeContent === 'plans' ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planos</h1>
            <button
              onClick={handleAddNewPlan}
              className="flex items-center px-4 py-2 bg-[#07152E] dark:bg-blue-600 text-white rounded-md hover:bg-[#132744] dark:hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Novo Plano
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6 bg-[#07152E] dark:bg-gray-900 text-white">
                  {editingPlan?.id === plan.id ? (
                    <input
                      type="text"
                      value={editingPlan.name}
                      onChange={(e) => handleFeatureChange('name', e.target.value)}
                      className="w-full text-xl font-bold text-center bg-transparent border-b border-white/30 focus:border-white outline-none"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-center">{plan.name}</h2>
                  )}
                  <div className="mt-4 text-center">
                    {editingPlan?.id === plan.id ? (
                      <input
                        type="number"
                        value={editingPlan.price}
                        onChange={(e) => handleFeatureChange('price', parseFloat(e.target.value))}
                        className="w-full text-3xl font-bold text-center bg-transparent border-b border-white/30 focus:border-white outline-none"
                      />
                    ) : (
                      <span className="text-3xl font-bold">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(plan.price)}
                      </span>
                    )}
                    <span className="text-sm">/mês</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {editingPlan?.id === plan.id ? (
                    <>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Caixas de Entrada
                          </label>
                          <input
                            type="number"
                            value={editingPlan.features.inboxes}
                            onChange={(e) => handleFeatureChange('inboxes', parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            WhatsApp Oficial
                          </label>
                          <select
                            value={editingPlan.features.whatsappOfficial.toString()}
                            onChange={(e) => handleFeatureChange('whatsappOfficial', e.target.value === 'true')}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="true">Sim</option>
                            <option value="false">Não</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Atendentes
                          </label>
                          <input
                            type="number"
                            value={editingPlan.features.agents}
                            onChange={(e) => handleFeatureChange('agents', parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Automações
                          </label>
                          <input
                            type="number"
                            value={editingPlan.features.automations}
                            onChange={(e) => handleFeatureChange('automations', parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={handleSave}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Salvar
                        </button>
                        <button
                          onClick={handleCancel}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400">{plan.features.inboxes}</span>
                          <span className="ml-2 text-gray-900 dark:text-gray-100">Caixa(s) de Entrada</span>
                        </li>
                        <li className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            {plan.features.whatsappOfficial ? 'Com' : 'Sem'}
                          </span>
                          <span className="ml-2 text-gray-900 dark:text-gray-100">WhatsApp Oficial</span>
                        </li>
                        <li className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400">{plan.features.agents}</span>
                          <span className="ml-2 text-gray-900 dark:text-gray-100">Atendentes</span>
                        </li>
                        <li className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400">{plan.features.automations}</span>
                          <span className="ml-2 text-gray-900 dark:text-gray-100">Automação(ões)</span>
                        </li>
                      </ul>
                      <button
                        onClick={() => handleEdit(plan)}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add-ons</h1>
            <button
              className="flex items-center px-4 py-2 bg-[#07152E] dark:bg-blue-600 text-white rounded-md hover:bg-[#132744] dark:hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Novo Add-on
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6 bg-[#07152E] dark:bg-gray-900 text-white">
                  <h2 className="text-xl font-bold text-center">{addon.name}</h2>
                  <div className="mt-4 text-center">
                    <span className="text-3xl font-bold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(addon.price)}
                    </span>
                    <span className="text-sm">/mês</span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{addon.description}</p>
                  <button
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Price Change Confirmation Modal */}
      {showPriceConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center text-yellow-600 dark:text-yellow-500 mb-4">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Confirmar alteração de preço</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
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
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSave}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
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