import { useState } from "react";
import { ToggleRight } from "lucide-react";

export default function ProposalForm2(id : string) {
  const [viewInactive, setViewInactive] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Professional");
  const [addons, setAddons] = useState({
    inbox: 0,
    agents: 12,
    metaAccount: 1,
    wiseappAutomation: 2,
    humanSupport: 0,
    assistedSetup: 0,
    customAutomation: 0,
    customizations: 0,
  });

  const plans = {
    Standard: 449,
    Professional: 649,
    Enterprise: 799,
  };

  const addonPrices = {
    inbox: 62.5,
    agents: 62.5,
    metaAccount: 62.5,
    wiseappAutomation: 115,
    humanSupport: 495,
    assistedSetup: 2500,
    customAutomation: 2500,
    customizations: 4800,
  };

  const totalAddons = Object.keys(addons).reduce(
    (sum, key) => sum + addons[key] * addonPrices[key],
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-3 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold">Proposta</h2>
      <div className="flex justify-between items-center my-4">
        <span className="font-medium">Ver Inativos</span>
        <button onClick={() => setViewInactive(!viewInactive)} className="focus:outline-none">
          <ToggleRight size={20} className={viewInactive ? "text-blue-500" : "text-gray-400"} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Coluna de Planos */}
        <div>
          <h3 className="font-semibold">Plano</h3>
          <div className="flex flex-col space-y-2 mt-2">
            {Object.keys(plans).map((plan) => (
              <button
                key={plan}
                className={`px-4 py-1 border rounded-md ${selectedPlan === plan ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan} (R$ {plans[plan]},00)
              </button>
            ))}
          </div>
        </div>

        {/* Coluna de Add-ons */}
        <div>
          <h3 className="font-semibold">Add-ons</h3>
          <div className="grid grid-cols-1 gap-2 mt-1">
            {Object.keys(addons).map((addon) => (
              <div key={addon} className="flex justify-between items-center">
                <span>
                  {addon.replace(/([A-Z])/g, ' $1')} (R$ {addonPrices[addon]})
                </span>
                <input
                  type="number"
                  min="0"
                  className="w-12 border rounded text-center"
                  value={addons[addon]}
                  onChange={(e) =>
                    setAddons({ ...addons, [addon]: Number(e.target.value) })
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
          <p className="mt-2">Plano: {selectedPlan} - R$ {plans[selectedPlan]},00</p>
          <p>Add-ons: R$ {totalAddons.toFixed(2)}</p>
          <h2 className="text-xl font-bold mt-2">Valor Total: R$ {(plans[selectedPlan] + totalAddons).toFixed(2)}/mês</h2>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button className="px-4 py-2 border rounded-md hover:bg-gray-100">Cancelar</button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Dados do Cliente</button>
      </div>
    </div>
  );
}