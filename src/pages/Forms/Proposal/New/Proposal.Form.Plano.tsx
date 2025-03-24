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
import {useCustomSetter} from "../../../../utils/Functions";

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
  const [valorDesconto, setValorDesconto] = useState(0);
  const [valorTotal, setValortotal] = useState(0);
  const [viewInactive, setViewInactive] = useState(false);

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-2xl font-bold text-gray-900 dark:text-white mb-6";
  const labelClass = "block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1";
  const labelClassCenter = "block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 text-center flex justify-center";
  const inputClassFlat = "w-full pl-1 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm text-center";
  const selectClass = "w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm appearance-none";
  const sectionClass = "mt-6 space-y-4";

  const setValue = useCustomSetter(setProposta);

  const totalAddons = addons.reduce(
    (sum, addon) => sum + (addonQuantities[addon.id] || 0) * addon.valor, 0
  );


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue(name, value);

    // Handle plan selection
    if (name === "plano_id") {
      const selected = plans.find(plan => plan.id === value);
      setSelectedPlan(selected);
      setValue("subtotal", selected?.valor);
      calcProposta();
    }

  };

  function calcProposta() {
    // if (!selectedPlan) return;
    let _addons = totalAddons;    
    const newSubTotal = proposta.subtotal + totalAddons;
    let _desconto = parseFloat(proposta.desconto?.toString().replace("%", "") || "0");
    let _valorDesconto = CalcPercent(newSubTotal, _desconto);
    setValorDesconto(_valorDesconto);
    
    const newTotal = newSubTotal + _valorDesconto;

    setValue("total_addons", _addons);
    setValue("total", newTotal);
  }

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      setValue("plano_id", selectedPlan.id);
      setValue("subtotal", selectedPlan.valor);
      calcProposta();
    }
  }, [selectedPlan]);

  useEffect(() => {
    calcProposta();
  }, [proposta.cupom_desconto, totalAddons]);

  useEffect(() => {
    calcProposta();
  }, [proposta.desconto]);

  useEffect(() => {
    if (selectedprofile) {
      setValue("perfil_id", selectedprofile.id);
      calcProposta();
    }
  }, [selectedprofile]);

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
    setPlansFilter(viewInactive ? plans : plans.filter(plan => plan.active === true));
  }, [plans, viewInactive]);


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
  }

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
        setPlansFilter(plans.filter(plan => plan.active));
        //Set First Active
        const firstActivePlan = data.find(plan => plan.active);
        setSelectedPlan(firstActivePlan);
        setValue("plano_id", firstActivePlan?.id);

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

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = value.replace(/\D/g, '');
    setValue(name, formattedValue ? `${formattedValue}%` : '');
  };

  const handleInactive = async () => {
    setViewInactive(!viewInactive);
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
                // onChange={(e) => setSelectedProfile(profiles.find(p => p.id === e.target.value))}
                onChange={handleInputChange}
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
                value={proposta.plano_id}
                name="plano_id"
                onChange={handleInputChange}
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

          </div>

          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Resumo da Assinatura</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Plano Base:</span>
                <span>{formatCurrency(proposta.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Add-ons:</span>
                <span>{formatCurrency(proposta.total_addons)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Descontos:</span>
                <span>{formatCurrency(valorDesconto)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Cupom:</span>
                <span>{formatPercent(proposta.cupom_desconto)}</span>
              </div>

              <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">Total Mensal:</span>
                <span className="text-3xl font-bold bg-brand/10 dark:bg-brand/20 text-brand dark:text-brand-400 px-4 py-2 rounded-lg">
                  {formatCurrency(proposta.total)}
                </span>
              </div>
            </div>


          </div>
        </div>
      </div>
  );
}