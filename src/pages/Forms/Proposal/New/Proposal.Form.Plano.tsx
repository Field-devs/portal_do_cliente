import React, { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import Plan from "../../../../Models/Plan";
import { useAuth } from "../../../../components/AuthProvider";
import PlanAddon from "../../../../Models/Plan.Addon";
import SwitchFrag from "../../../../components/Fragments/SwitchFrag";
import Profile from "../../../../Models/Perfil";
import CircularWait from "../../../../components/CircularWait";
import { PropostaDTO } from "../../../../Models/Propostas";
import { formatCurrency, formatPercent } from "../../../../utils/formatters";
import { CalcPercent } from "../../../../utils/Finan";
import { Filter, Package, DollarSign } from 'lucide-react';
import PropostaAddon from "../../../../Models/Propostas.Addon";

export default function ProposalFormPlano({ proposta, setProposta }: { proposta: PropostaDTO, setProposta: (data: PropostaDTO) => void }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedprofile, setSelectedProfile] = useState<Profile>();
  const [selectedPlan, setSelectedPlan] = useState<Plan>();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansFilter, setPlansFilter] = useState<Plan[]>([]);

  const [addons, setAddons] = useState<PlanAddon[]>([]);
  const [addonQuantities, setAddonQuantities] = useState<Record<number, number>>({});

  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [valorDescont, setValorDescont] = useState(0);

  const [viewInactive, setViewInactive] = useState(false);

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-2xl font-bold text-gray-900 dark:text-white mb-6";
  const labelClass = "block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1";
  const labelClassCenter = "block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 text-center flex justify-center";
  const inputClassFlat = "w-full pl-1 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm text-center";
  const selectClass = "w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm appearance-none";
  const sectionClass = "mt-6 space-y-4";


  const setFieldValue = (key: string, value: any): void => {
    setProposta({ ...proposta, [key]: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = value.replace(/\D/g, '');
    setFieldValue(name, formattedValue ? `${formattedValue}%` : '');
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchAddon = async (): Promise<PropostaAddon[]> => {
    let filterAddons = addons.filter(addon => addonQuantities[addon.id] > 0);
    if (filterAddons.length === 0) {
      setProposta({
        ...proposta,
        addons: []
      });
      return [];
    }
    let propostaAddon: PropostaAddon[] = [];
    filterAddons.forEach(addon => {
      propostaAddon.push({
        addon_id: addon.id,
        proposta_id: proposta.id,
        qtde: addonQuantities[addon.id],
        unit: addon.valor,
      });
    });
    setProposta({
      ...proposta,
      addons: propostaAddon
    });
    setFieldValue("plano_id", selectedPlan.id);
  }

  useEffect(() => {
    if (loading) setLoading(false);
    if (selectedPlan && selectedprofile) {

      if (selectedprofile) {
        setFieldValue("plano_id", selectedPlan.id);
        setFieldValue("subtotal", selectedPlan.valor);
        setFieldValue("perfil_id", selectedprofile.id);
      }
      calcProposta();
    }
  }, [selectedPlan, selectedprofile]);


  const fetchCupom = async (cupom: string) => {
    var { data } = await supabase.from("v_cliente").select("desconto").eq("cupom", cupom).eq("f_cupom_valido", true).limit(1);
    if (data) {
      const cliente = data[0];
      if (cliente == null) {
        setProposta({
          ...proposta,
          cupom_desconto: 0
        });
        return;
      }
      setProposta({
        ...proposta,
        cupom_desconto: cliente.desconto / 100
      });

    }

  }

  const fetchData = async () => {
    try {
      var { data } = await supabase.from("plano").select("*").eq("user_id", user?.id);
      if (data && Array.isArray(data) && data.length > 0) {
        setPlans(data);
        setSelectedPlan(data[0]); // Set the first plan as default
        setFieldValue("plano_id", data[0].id); // Ensure the default plan is reflected in the proposal
      } else {
        console.warn("No plans found for the user.");
      }

      var { data } = await supabase.from("plano_addon").select("*").eq("user_id", user?.id);
      if (data) {
        setAddons(data);
      }

      var { data } = await supabase.from("perfil").select("*")
        .gt("id", user?.perfil_id)
        .neq("id", 1)
        .neq("id", 2)
        .neq("id", 6) // Afiliado Comercial
        .neq("id", user?.perfil_id == 3 ? 0 : 4)
        ;

      if (data) {
        setProfiles(data);
        setSelectedProfile(data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    if (proposta.cupom) {
      if (proposta.cupom.trim().length == 16) {
        fetchCupom(proposta.cupom);
      }
      else {
        setProposta({
          ...proposta,
          cupom_desconto: 0
        });
      }
    }
  }, [proposta.cupom]);

  useEffect(() => {
    calcProposta();
  }, [proposta.desconto]);


  useEffect(() => {
    setPlansFilter(viewInactive ? plans : plans.filter(plan => plan.active));
  }, [viewInactive, selectedPlan]);


  const totalAddons = addons.reduce(
    (sum, addon) => sum + (addonQuantities[addon.id] || 0) * addon.valor, 0
  );

  useEffect(() => {
    if (!selectedPlan) return;
    const descontoValue = parseFloat(proposta.desconto.toString().replace("%", "")) || 0;
    const newTotal = selectedPlan?.valor + totalAddons - descontoValue;
    setTotal(newTotal);
    setFieldValue("total", newTotal);
    fetchAddon();
  }, [selectedPlan, totalAddons]);

  const handleInactive = async () => {
    setViewInactive(!viewInactive);
  }

  function calcProposta() {
    if (!selectedPlan) return;
    const newSubtotal = selectedPlan.valor + totalAddons;
    let _desconto = parseFloat(proposta.desconto?.toString().replace("%", "") || "0");
    setValorDescont(CalcPercent(newSubtotal, _desconto));
    fetchAddon(); 
  }

  return (
    loading ? <CircularWait message="Carregando..." small={true} /> :
      <div className={cardClass}>
        <h2 className={titleClass}>Escolha de Plano e Add-ons</h2>

        <div className={sectionClass}>
          <div>
            <label className={labelClass}>Tipo de Cliente</label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedprofile?.id}
                onChange={(e) => setSelectedProfile(profiles.find(p => p.id === e.target.value))}
                className={selectClass}
              >
                <option value="">Selecione um tipo de cliente</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="relative group ml-auto">
                <div className="flex items-center space-x-4">
                  <div>
                    Ver Inativos
                  </div>
                  <div>
                    <SwitchFrag onClick={handleInactive} checked={viewInactive} />
                  </div>
                </div>
              </div>
            </div>


            <label className={labelClass}>Plano</label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

              <select
                value={selectedPlan?.id}
                onChange={(e) => setSelectedPlan(plans.find(p => p.id === e.target.value))}
                className={selectClass}
              >
                <option value="">Selecione um plano</option>

                {plansFilter.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.nome}
                  </option>
                ))}



              </select>

            </div>

          </div>

          <div>
            <label className={labelClass}>Add-ons</label>
            <div className="space-y-2">
              {addons.filter(addon => viewInactive && !addon.active).map((addon) => (
                <div key={addon.id} className="flex justify-between items-center">
                  <span>
                    {addon.nome.replace(/([A-Z])/g, ' $1')} ({formatCurrency(addon.valor)})
                  </span>
                </div>
              ))}
              {addons.filter(addon => addon.active).map((addon) => (
                <div key={addon.id} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-gray-800 dark:text-gray-200">{addon.nome.replace(/([A-Z])/g, ' $1')} ({formatCurrency(addon.valor)})</span>
                  <input
                    type="number"
                    className="w-20 text-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
                    value={addonQuantities[addon.id] || 0}
                    onChange={(e) => setAddonQuantities({
                      ...addonQuantities,
                      [addon.id]: Number(e.target.value)
                    })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4 items-center">
            <div className="col-span-2">
              <label className={labelClassCenter}>Desconto</label>
              <div className="relative">
                <input
                  name="desconto"
                  className={inputClassFlat}
                  value={proposta.desconto}
                  onChange={handleDiscountChange}
                  placeholder="0%"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className={labelClassCenter}>Validade</label>
              <div className="relative">
                <input
                  name="validade"
                  className={inputClassFlat}
                  value={proposta.validade}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="30"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className={labelClassCenter}>Cupom Promocional</label>
              <div className="relative">
                <input
                  name="desconto"
                  className={inputClassFlat}
                  value={proposta.cupom}
                  //onChange={handleDiscountChange}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 20);
                    setProposta({ ...proposta, cupom: value });
                  }}
                />
              </div>
            </div>
            {/* 
            <div className="col-span-2">
              {loadCupon ? (
                <>
                  <label className={labelClassCenter}>Aplicando...</label>
                </>
              ) : (
                <>
                  <label className={labelClassCenter}>Cupom</label>
                  <button
                    onClick={handleApplyCupon}
                    className={`w-full h-[calc(3rem)] bg-brand text-white rounded-lg shadow-sm hover:bg-brand-dark transition-colors flex items-center justify-center`}
                  >
                    Aplicar
                  </button>
                </>
              )}
            </div> */}


          </div>

          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Resumo da Assinatura</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Plano Base:</span>
                <span>{formatCurrency(total || 0)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Add-ons:</span>
                <span>{formatCurrency(totalAddons)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Descontos:</span>
                <span>{formatCurrency(valorDescont)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Cupom:</span>
                <span>{formatPercent(proposta.cupom_desconto)}</span>
              </div>

              <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">Total Mensal:</span>
                <span className="text-3xl font-bold bg-brand/10 dark:bg-brand/20 text-brand dark:text-brand-400 px-4 py-2 rounded-lg">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>


          </div>
        </div>
      </div>
  );
}