import { useState, useEffect } from 'react';
import Plan from '../../Models/Plan';
import { supabase } from '../../lib/supabase';
import { getInitialArray } from '../../utils/Utils';
import Proposta from '../../Models/Propostas';

import {
  HeadphonesIcon,
  Layout,
  Phone
} from 'lucide-react';


export default function ProposalForm() {
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [planos, setPlanos] = useState<Plan[]>([]);
  const [etapa, setEtapa] = useState(0);
  const [filterCaixas, setFilterCaixa] = useState(1);
  const [filterAtendentes, setFilterAtendentes] = useState(1);
  const [filterAutomacoes, setFilterAutomacoes] = useState(1);

  const [formData, setFormData] = useState<Proposta>({
    Id: '',
    dt: '',
    cliente_id: 0,
    plano_id: 0,
    plano_nome: '',
    caixas_entrada_qtde: 0,
    atendentes_qtde: 0,
    automacoes_qtde: 0,
    subtotal: 0,
    kanban: true,
    suporte_humano: false,
    whatsapp_oficial: false,
    caixas_entrada_add_qtde: 0,
    caixas_entrada_add_unit: 0,
    atendentes_add_qtde: 0,
    atendentes_add_unit: 0,
    automacoes_add_qtde: 0,
    automacoes_add_unit: 0,
    total: 0,
    validade: 1,
    mail_send: false,
    status: 'PE',
    status_title: '',
    user_id: '',
    nome: '',
    cnpj: '',
    email: '',
    fone: ''
  });

  useEffect(() => {
    //fetchPlanos();
  }, []);

  // Filtra Conforme Seleciona
  useEffect(() => {

    const fetchPlanos = async (uuid: string) => {
      const { data: responseData, error: responseError } = await supabase
        .from('plano')
        .select('*')
        .eq('id', uuid)
        ;
      if (responseError) {
        console.error("Erro ao buscar planos:", responseError);
        return;
      }

      if (responseData) {
        setPlanos(responseData as Plan[]);
      }
    };


    const fetchFilterPlansId = async () => {
      const { data, error: rpcError } = await supabase.rpc('fn_plan_filter', {
        p_caixas: filterCaixas,
        p_atendente: filterAtendentes,
        p_automacoes: filterAutomacoes
      });
      if (rpcError) {
        console.error("Erro ao buscar planos:", rpcError);
        return;
      }
      console.log('Data', data);
      if (data) {
        await fetchPlanos(data[0]);
      }
      console.log('Filter', filterCaixas, filterAtendentes, filterAutomacoes);
      console.log('data', data);
    };


    fetchFilterPlansId();

  }, [filterCaixas, filterAtendentes, filterAutomacoes]);




  const getSelectOptions = (singleTitle: string, startIndex: number, addvalue: number) => {
    const titleStart = `${startIndex} ${startIndex == 1 ? singleTitle : singleTitle} Inclusa`;
    const options = getInitialArray(startIndex).map((value: number, index: number) => (
      <option key={value} value={value}>
        {index === 0 ? titleStart : `${titleStart} + ${index} Adicional por R$ ${addvalue * index}`}
      </option>
    ));
    return options;
  };

  const getListItens = (title: string, startIndex: number) => {
    const options = getInitialArray(startIndex).map((value: number, index: number) => (
      <option key={value} value={value}>
        {`${index + 1} - ${title}`}
      </option>
    ));
    return options;
  };



  const handleSubmit = () => {
  }

  const setFieldValue = (field: string, value: any) => {
    console.log(formData.caixas_entrada_add_qtde);
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value
    }));
  };

  const CalcTotal = () => {
    setFieldValue('caixas_entrada_add_qtde', formData.caixas_entrada_add_qtde + 1);
    console.log('caixas_entrada_add_qtde', formData.caixas_entrada_add_qtde);
    setFieldValue('total',
      formData.total = formData.subtotal +
      (formData.caixas_entrada_add_qtde * formData.caixas_entrada_add_unit)
    );
  };

  const handleFilter = (e: any) => {
    //setSearchTerm(e.target.value);
  };


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

              {etapa === 0 && (
                <div>
                  {/* Plan Selection */}
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Informação do Plano</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="border rounded-lg p-4 dark:border-gray-600">

                      <div className="grid grid-cols-3 gap-4">
                        {/* Caixa de Entrada */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Caixas de Entrada
                          </label>
                          <select
                            name='filterCaixas'
                            value={filterCaixas}
                            onChange={(e) => setFilterCaixa(parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 text-left"
                          >
                            {getListItens('Caixa', 1)}
                          </select>
                        </div>

                        {/* Atendentes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Atendentes
                          </label>
                          <select
                            name='filterAtendentes'
                            value={filterAtendentes}
                            onChange={(e) => setFilterAtendentes(parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 text-left"
                          >
                            {getListItens('Atendente', 1)}
                          </select>
                        </div>

                        {/* Automações */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Automações
                          </label>
                          <select
                            name='filterAutomacoes'
                            value={filterAutomacoes}
                            onChange={(e) => setFilterAutomacoes(parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 text-left"
                          >
                            {getListItens('Automaçao(es)', 1)}
                          </select>
                        </div>


                      </div>


                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {planos.map(plano => (
                      <div key={plano.id} className="border rounded-lg p-4 dark:border-gray-600">
                        <div className="flex items-center space-x-4">
                          <input
                            type="radio"
                            name="id"
                            value={plano.id}
                            //onChange={handleInputChange}
                            onChange={() => {
                              setFieldValue('plano_id', plano.id);
                              setFieldValue('plano_nome', plano.nome);
                              setFieldValue('subtotal', plano.valor);

                              setFieldValue('caixas_entrada_add_unit', plano.caixas_entrada_add);
                              setFieldValue('atendentes_add_unit', plano.atendentes_add);
                              setFieldValue('automacoes_add_unit', plano.automacoes_add);
                            }}
                            className="h-4 w-4 text-brand focus:ring-brand"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{plano.nome}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{plano.descricao}</p>
                            <div className="mt-2 space-y-1">

                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">

                                <div className="mr-2">
                                  <select
                                    name='caixas_entrada_add_qtde'
                                    value={formData.caixas_entrada_add_qtde}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 text-left"
                                    onChange={(e) => {
                                      setFieldValue('caixas_entrada_add_qtde', e.target.value); // Assuming you're using Formik or similar
                                      CalcTotal();
                                    }}
                                  >
                                    {getSelectOptions('Caixa de Entrada', plano.caixas_entrada, 10)}
                                  </select>
                                </div>
                              </p>


                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <div className="mr-2">
                                  <select
                                    value={formData.atendentes_add_qtde}
                                    name='atendentes_add_qtde'
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 w-[65px] text-left"
                                    onChange={(e) => {
                                      console.log('atendentes_add_qtde', e.target.value);
                                      setFieldValue('atendentes_add_qtde', e); // Assuming you're using Formik or similar
                                    }}
                                  >
                                    {getSelectOptions('Atendente', plano.atendentes, 10)}
                                  </select>
                                </div>
                              </p>

                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <div className="mr-2">
                                  <select
                                    value={formData.automacoes_qtde}
                                    name='automacoes'
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600 w-[65px] text-left"
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value, 10);
                                      setFieldValue('automacoes_qtde', value); // Assuming you're using Formik or similar
                                    }}
                                  >
                                    {getSelectOptions('Automação', plano.atendentes, 10)}

                                  </select>
                                </div>
                              </p>

                              {plano.suporte_humano && (
                                <div className="flex items-center space-x-2">
                                  <HeadphonesIcon className="h-5 w-5 text-gray-400" />
                                  <span className="text-gray-700 dark:text-gray-300">Suporte Humano</span>
                                </div>
                              )}

                              {plano.kanban && (
                                <div className="flex items-center space-x-2">
                                  <Layout className="h-5 w-5 text-gray-400" />
                                  <span className="text-gray-700 dark:text-gray-300">Kanban</span>
                                </div>
                              )}

                              {plano.whatsapp_oficial && (
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-5 w-5 text-gray-400" />
                                  <span className="text-gray-700 dark:text-gray-300">WhatsApp Oficial</span>
                                </div>
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

                  {/* Total Value */}
                  <div className="border-t pt-4 mt-6">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium text-gray-900 dark:text-white">Valor Total:</p>
                      <p className="text-2xl font-bold text-brand">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(formData.total)}
                        <span className="text-sm text-gray-500">/mês</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {etapa === 1 && (
                <div>
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Informações da Empresa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nome
                        </label>
                        <input
                          type="text"
                          name="nome"
                          value={formData.nome}
                          // onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          //onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand dark:bg-gray-700 dark:border-gray-600"
                          required
                        />
                      </div>

                    </div>
                  </div>



                </div>
              )}

              {etapa === 0 && (
                <div>
                </div>
              )}


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
