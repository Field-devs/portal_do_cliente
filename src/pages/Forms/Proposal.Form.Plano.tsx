import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Plan from "../../Models/Plan";
import { useAuth } from "../../components/AuthProvider";
import PlanAddon from "../../Models/Plan.Addon";
import { AskDialog } from "../../components/Dialogs/SweetAlert";
import SwitchFrag from "../../components/Fragments/SwitchFrag";
import Profile from "../../Models/Perfil";
import CircularWait from "../../components/CircularWait";
import FormProps from "../../Models/FormProps";
import { Proposta } from "../../Models/Propostas";
import { Listbox } from '@headlessui/react'

export default function ProposalFormPlano({ onSubmit }: FormProps) {
  const { user } = useAuth();
  const [proposta, setProposta] = useState<Proposta>();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedprofile, setSelectedProfile] = useState<Profile>();
  const [viewInactive, setViewInactive] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [addons, setAddons] = useState<PlanAddon[]>([]);
  const [addonQuantities, setAddonQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  console.log("START");

  useEffect(() => {
    if (selectedPlan && selectedprofile) {
      setProposta({
        perfil_id: selectedprofile.id,
        plano_id: selectedPlan.id,
        addons: addons.filter(addon => addonQuantities[addon.id] > 0).map(addon => ({
          addon_id: addon.id,
          quantidade: addonQuantities[addon.id]
        }))
      });
    }
  }, [selectedPlan, selectedprofile]);


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(proposta);
    onSubmit(proposta);
  };

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

      var { data } = await supabase.from("perfil").select("*").gt("id", 2);
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
    (sum, addon) => sum + (addonQuantities[addon.id] || 0) * addon.valor,
    0
  );


  const handleInactive = async () => {
    setViewInactive(!viewInactive);
  }

  return (

    loading ? <CircularWait message="Carregando..." /> :

      <div className="max-w-4xl mx-auto p-3 bg-white shadow-md rounded-lg">

        <div className="grid grid-cols-1 gap-1">
          {/* Coluna de Planos */}
          <div>
            <h3 className="font-semibold">Tipo de Cliente</h3>
            <div className="flex flex-row mt-2">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  className={`px-4 py-1 border rounded-md ${selectedprofile === profile ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                  onClick={() => setSelectedProfile(profile)}
                  value={proposta?.perfil_id}
                >
                  {profile.nome}
                </button>
              ))}
            </div>
          </div>
        </div>

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


        <div className="grid grid-cols-2 gap-6">
          {/* Coluna de Planos */}
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

                  {plans.filter(plan => plan.active === true).map((plan) => (
                    <Listbox.Option
                      key={plan.id}
                      value={plan}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <span className={`block truncate font-normal'}`}>
                          {plan.nome}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}

                  {plans.filter(plan => plan.active === true).map((plan) => (
                    <Listbox.Option
                      key={plan.id}
                      value={plan}
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

          {/* Coluna de Add-ons */}
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
                    {addon.nome.replace(/([A-Z])/g, ' $1')} (R$ {addon.valor})
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

        <div className="mt-6 rounded-md border">
          <div className="p-4">
            <h3 className="font-semibold">Resumo da Assinatura</h3>
            <p className="mt-2">Plano: {selectedPlan?.nome} - R$ {selectedPlan?.valor || 0},00</p>
            <p>Add-ons: R$ {totalAddons.toFixed(2)}</p>
            <h2 className="text-xl font-bold mt-2">
              Valor Total: R$ {((selectedPlan?.valor || 0) + totalAddons).toFixed(2)}/mês
            </h2>
          </div>
        </div>

        {/* <div className="flex justify-between mt-4"> */}
        {/* <button className="px-4 py-2 border rounded-md hover:bg-gray-100" onClick={handleCancel} >Cancelar</button> */}
        {/* <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Dados do Cliente</button> */}
        {/* </div> */}
      </div>
  );
}