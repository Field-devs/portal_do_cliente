import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Plan from "../../Models/Plan";
import { useAuth } from "../../components/AuthProvider";
import PlanAddon from "../../Models/Plan.Addon";
import { AskDialog } from "../../components/Dialogs/SweetAlert";
import SwitchFrag from "../../components/Fragments/SwitchFrag";
import Profile from "../../Models/Perfil";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen, faUnlock } from '@fortawesome/free-solid-svg-icons';
import CircularWait from "../../components/CircularWait";

export default function ProposalForm2(id: string) {
  const { user } = useAuth();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedprofile, setSelectedProfile] = useState<Profile>();
  const [viewInactive, setViewInactive] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [addons, setAddons] = useState<PlanAddon[]>([]);
  const [addonQuantities, setAddonQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);



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

  const handleCancel = async () => {
    await AskDialog("Você tem certeza que deseja cancelar a edição da proposta atual ?").then((result) => {
      if (result.isConfirmed) {
        console.log("Confirmed");
        return true;
      } else {
        console.log("Cancelled");
        return false;
      }
    });
  };

  const handleInactive = async () => {
    setViewInactive(!viewInactive);
  }

  return (

    loading ? <CircularWait message="Carregando..." /> :

      <div className="max-w-4xl mx-auto p-3 bg-white shadow-md rounded-lg">

        <div className="grid grid-cols-1 gap-1">
          {/* Coluna de Planos */}
          <div>
            <h3 className="font-semibold">Perfil de Acesso</h3>
            <div className="flex flex-row mt-2">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  className={`px-4 py-1 border rounded-md ${selectedprofile === profile ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                  onClick={() => setSelectedProfile(profile)}
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
            <div className="flex flex-col space-y-2 mt-2">

              {plans.filter(plan => viewInactive && !plan.active).map((plan) => (
                <button
                  key={plan.id}
                  disabled={true}
                  className={`px-4 py-1 ${selectedPlan === plan ? "bg-blue-500 text-white" : ""}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <FontAwesomeIcon icon={faLock} className="ml-1  text-red-500" /> {plan.nome} (R$ {plan.valor},00)
                </button>
              ))}

              {plans.filter(plan => plan.active == true).map((plan) => (
                <button
                  key={plan.id}
                  className={`px-4 py-1 border rounded-md font-bold ${selectedPlan === plan ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <FontAwesomeIcon icon={faLockOpen} className="ml-1 text-yellow-500" /> {plan.nome} (R$ {plan.valor},00)
                </button>
              ))}


            </div>
          </div>

          {/* Coluna de Add-ons */}
          <div>
            <h3 className="font-semibold">Add-ons</h3>
            <div className="grid grid-cols-1 gap-2 mt-1">

              {addons.filter(addon => viewInactive && !addon.active).map((addon) => (
                <div key={addon.id} className="flex justify-between items-center">
                  <span>
                    <FontAwesomeIcon icon={faLock} className="ml-1 text-red-500" /> {addon.nome.replace(/([A-Z])/g, ' $1')} (R$ {addon.valor})
                  </span>

                </div>
              ))}

              {addons.filter(addon => addon.active == true).map((addon) => (
                <div key={addon.id} className="flex justify-between items-center font-bold ">
                  <span>
                    <FontAwesomeIcon icon={faLockOpen} className="ml-1  text-yellow-500" /> {addon.nome.replace(/([A-Z])/g, ' $1')} (R$ {addon.valor})
                  </span>
                  <input
                    type="number"
                    min="0"
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

        <div className="flex justify-between mt-4">
          <button className="px-4 py-2 border rounded-md hover:bg-gray-100" onClick={handleCancel} >Cancelar</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Dados do Cliente</button>
        </div>
      </div>
  );
}