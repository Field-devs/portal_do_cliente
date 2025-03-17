import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Plan from "../../Models/Plan";
import { useAuth } from "../../components/AuthProvider";
import PlanAddon from "../../Models/Plan.Addon";
import SwitchFrag from "../../components/Fragments/SwitchFrag";
import Profile from "../../Models/Perfil";
import CircularWait from "../../components/CircularWait";
import { PropostaDTO } from "../../Models/Propostas";
import { Listbox } from '@headlessui/react'
import { formatCurrency } from "../../utils/formatters";
import { CalcPercent } from "../../utils/Finan";

export default function ProposalFormPlano({ proposta, setProposta }: { proposta: PropostaDTO, setProposta: (data: PropostaDTO) => void }) {

  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedprofile, setSelectedProfile] = useState<Profile>();
  const [viewInactive, setViewInactive] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [addons, setAddons] = useState<PlanAddon[]>([]);
  const [addonQuantities, setAddonQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProposta({ ...proposta, [name]: value });
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters
    setProposta({ ...proposta, [name]: formattedValue ? `${formattedValue}%` : '' });
  };

  useEffect(() => {
    if (selectedPlan && selectedprofile) {
      setProposta({
        perfil_id: selectedprofile.id,
        plano_id: selectedPlan.id,
        plano_nome: selectedPlan.nome,
        desconto: 0,
        total: 0,
        subtotal: 0,
        addons: addons.filter(addon => addonQuantities[addon.id] > 0).map(addon => ({
          addon_id: addon.id,
          quantidade: addonQuantities[addon.id]
        }))
      });
      console.log(proposta);
      calcProposta();
    }
  }, [selectedPlan, selectedprofile]);

  function calcProposta() {
    if (!selectedPlan) return;
    const newSubtotal = selectedPlan.valor + totalAddons;
    setSubtotal(newSubtotal);
    console.log(newSubtotal);
    // remove simbola in desconto
    const desconto = parseFloat(proposta.desconto.toString().replace("%", "") || "0");
    setTotal(newSubtotal - CalcPercent(newSubtotal, parseFloat(desconto)));
    console.log("desconto", desconto);
    console.log(total);
  }

  const fetchData = async () => {
    try {
      var { data } = await supabase.from("plano").select("*").eq("user_id", user?.id);
      if (data) {
        setPlans(data);
        setSelectedPlan(data[0]);
      }

      var { data } = await supabase.from("plano_addon").select("*").eq("user_id", user?.id);
      if (data) {
        setAddons(data);
      }

      var { data } = await supabase.from("perfil").select("*")
        .gt("id", user?.perfil_id)
        .neq("id", 1)
        .neq("id", 2)
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
    setLoading(true);
    fetchData();
  }, []);

  const totalAddons = addons.reduce(
    (sum, addon) => sum + (addonQuantities[addon.id] || 0) * addon.valor, 0
  );

  useEffect(() => {
    setProposta({
      ...proposta,
      total: proposta.subtotal + totalAddons - proposta.desconto,
    });
    calcProposta();
  }, [totalAddons, proposta.desconto]);

  const handleInactive = async () => {
    setViewInactive(!viewInactive);
  }

  return (
    loading ? <CircularWait message="Carregando..." small={true} /> :
      <div className="max-w-4xl mx-auto p-3 bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-1 gap-1">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h1 className="text-2xl font-bold">Proposta</h1>
            </div>
            <div>
              <div className="flex flex-col items-end my-4 gap-1">
                <span className="font-medium">Ver Inativos</span>
                <SwitchFrag
                  onClick={handleInactive}
                  checked={viewInactive}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="relative z-50">
            <h3 className="font-semibold">Tipo de Cliente</h3>
            <Listbox value={selectedprofile} onChange={setSelectedProfile}>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2">
                  <span className="block truncate">
                    {selectedprofile?.nome || 'Selecione um tipo de cliente'}
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  {profiles.map((profile) => (
                    <Listbox.Option
                      key={profile.id}
                      value={profile}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                          {profile.nome}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          <div>
            <h3 className="font-semibold">Plano</h3>
            <Listbox value={selectedPlan} onChange={setSelectedPlan}>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2">
                  <span className="block truncate">
                    {selectedPlan?.nome || 'Selecione um plano'}
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  {plans.map((plan) => (
                    <Listbox.Option
                      key={plan.id}
                      value={plan}
                      onChange={setSelectedPlan}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                          {plan.nome}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          <div>
            <h3 className="font-semibold">Add-ons</h3>
            <div className="grid grid-cols-1 gap-2 mt-1">
              {addons.filter(addon => viewInactive && !addon.active).map((addon) => (
                <div key={addon.id} className="flex justify-between items-center">
                  <span>
                    {addon.nome.replace(/([A-Z])/g, ' $1')} (R$ {addon.valor})
                  </span>
                </div>
              ))}
              {addons.filter(addon => addon.active == true).map((addon) => (
                <div key={addon.id} className="flex justify-between items-center">
                  <span>
                    {addon.nome.replace(/([A-Z])/g, ' $1')} ({formatCurrency(addon.valor)})
                  </span>
                  <input
                    className="w-12 border rounded text-center"
                    value={addonQuantities[addon.id] || 0}
                    onChange={(e) =>
                      setAddonQuantities({
                        ...addonQuantities,
                        [addon.id]: Number(e.target.value)
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <h3 className="font-semibold">Desconto</h3>
            <input
              name="desconto"
              className="w-full border rounded p-2"
              value={proposta.desconto}
              onChange={handleDiscountChange}
            />
          </div>

          <div className="col-span-3">
            <h3 className="font-semibold">Validade (dias)</h3>
            <input
              className="w-full border rounded p-2"
              name="validade"
              value={proposta.validade}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-6 rounded-md border">
          <div className="p-4">
            <h3 className="font-semibold">Resumo da Assinatura</h3>
            <p className="mt-2">Plano: {selectedPlan?.nome} - {formatCurrency(selectedPlan?.valor)}</p>
            <p>Add-ons: {formatCurrency(totalAddons)}</p>
            <h2 className="text-xl font-bold mt-2">
              {/* Valor Total: {formatCurrency((selectedPlan?.valor || 0) + totalAddons)}/mês */}
              Valor Total: {formatCurrency(total)}/mês
            </h2>
          </div>
        </div>
      </div>
  );
}