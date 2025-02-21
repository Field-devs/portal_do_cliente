import { useState, useEffect } from 'react';
import Plan from '../../Models/Plan';
import { supabase } from '../../lib/supabase';

export default function ProposalForm() {
    const [isFormOpen, setIsFormOpen] = useState(true);
    const [planos, setPlanos] = useState<Plan[]>([]);
    const [addons, setAddons] = useState([]);
    const [totalValue, setTotalValue] = useState(0);

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        fone: '',
        cnpj: '',
        plano_id: ''
    });

    useEffect(() => {
      const fetchPlanos = async () => {
          const { data: responseData, error: responseError } = await supabase
              .from('plano')
              .select('*');

          if (responseError) {
              console.error("Erro ao buscar planos:", responseError);
              return;
          }

          if (responseData) {
              setPlanos(responseData as Plan[]);
          }
      };

      fetchPlanos();
  }, []);


    const handleSubmit = (event) => {
    }

    return (
      <>
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Nova Proposta</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                {/* <X className="h-6 w-6" /> */}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informações da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="nomeEmpresa"
                      value={formData.nome}
                      // onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      CNPJ/CPF
                    </label>
                    <input
                      type="text"
                      name="cnpj"
                      value={formData.cnpj}
                      // onChange={handleInputChange}
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
                      //onChange={handleInputChange}
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
                      //onChange={handleInputChange}
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
                      //onChange={handleInputChange}
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
                      //onChange={handleInputChange}
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
                      //onChange={handleInputChange}
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
                          //onChange={handleInputChange}
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
                          //onChange={() => handleAddonToggle(addon.addon_id)}
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
      </>
    );
}
