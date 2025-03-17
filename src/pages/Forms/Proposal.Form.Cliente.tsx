import { Mail } from "lucide-react";
import { Proposta, PropostaDTO } from "../../Models/Propostas";

export default function ProposalFormCliente({ proposta, setProposta }: { proposta: PropostaDTO, setProposta: (data: PropostaDTO) => void }) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProposta({ ...proposta, [name]: value });
  };
  console.log(proposta);
  // Common CSS classes
  const containerClass = "max-w-4xl mx-auto p-3 bg-white shadow-md rounded-lg";
  const titleClass = "text-3xl font-bold";
  const labelClass = "block text-sm font-medium text-gray-700";
  const inputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const sectionClass = "mt-4";

  return (
    <div className={containerClass}>
      <h1 className={titleClass}>Confirmar Dados</h1>

      <div className={sectionClass}>
        <label className={labelClass}>Nome</label>
        <input
          type="text"
          name="emp_nome"
          value={proposta.emp_nome}
          onChange={(e) => handleChange(e)}
          className={inputClass}
        />
      </div>

      <div className={sectionClass}>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          name="emp_email"
          value={proposta.emp_email}
          onChange={(e) => handleChange(e)}
          className={inputClass}
        />
      </div>
    </div>
  );
}
