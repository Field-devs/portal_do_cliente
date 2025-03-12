import FormProps from "../../Models/FormProps";
import Proposta from "../../Models/Propostas";


export default function ProposalFormCliente({ proposta, setProposta }: { proposta: Proposta, setProposta: (data: Proposta) => void }) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProposta({ ...proposta, [name]: value });
  };

  return (
    <div className="max-w-4xl mx-auto p-3 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">Confirmar Dados</h1>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          value={proposta.nome}
          onChange={(e) => handleChange(e)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Endereço</label>
        <input
          type="text"
          value={proposta.email}
          onChange={(e) => handleChange(e)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>




    </div>
  );
}
