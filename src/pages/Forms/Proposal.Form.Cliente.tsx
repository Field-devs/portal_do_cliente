import { Mail } from "lucide-react";
import { Proposta, PropostaDTO } from "../../Models/Propostas";

interface ProposalFormClienteProps {
  proposta: PropostaDTO;
  setProposta: (data: PropostaDTO) => void;
  onBack?: () => void;
}

export default function ProposalFormCliente({ proposta, setProposta, onBack }: ProposalFormClienteProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProposta({ ...proposta, [name]: value });
  };
  console.log("Proposta Cliente", proposta);
  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-2xl font-bold text-light-text-primary dark:text-white mb-6";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputClass = "w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm";
  const buttonClass = "px-4 py-2 flex items-center justify-center rounded-lg text-sm font-medium transition-colors";

  return (
    <div className={cardClass}>
      <h2 className={titleClass}>Dados do Cliente</h2>

      <div className="space-y-4">
        <label className={labelClass}>Nome</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="emp_nome"
            value={proposta.emp_nome}
            onChange={handleChange}
            className={inputClass}
            placeholder="Nome da empresa"
          />
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <label className={labelClass}>Email</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            name="emp_email"
            value={proposta.emp_email}
            onChange={handleChange}
            className={inputClass}
            placeholder="email@empresa.com"
          />
        </div>
      </div>
      
      {onBack && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Voltar
          </button>
        </div>
      )}
    </div>
  );
}