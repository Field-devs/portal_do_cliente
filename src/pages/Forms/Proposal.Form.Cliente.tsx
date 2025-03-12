import { useState } from "react";
import FormProps from "../../Models/FormProps";
import { User, MapPin, Calendar, AlertCircle, Save, Phone, Mail } from 'lucide-react';
import { Proposta } from "../../Models/Propostas";

export default function ProposalFormCliente({ sender }: FormProps) {
  const [proposta, setProposta] = useState<Proposta>(sender);
  const [name, setName] = useState('');
  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Handle form submission logic here
      console.log("Form submitted with data:", { name, address, birthDay });
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Erro ao enviar formulário. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const cardClass = "bg-white dark:bg-[#1E293B]/70 backdrop-blur-sm p-6 border border-gray-200 dark:border-gray-700/50 shadow-lg";
  const inputClass = "pl-12 block w-full border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-[#0F172A]/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand focus:border-transparent transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const iconClass = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      <div className={cardClass}>
        {/* Reduce margin bottom on header */}
        <div className="flex items-center space-x-3 mb-1">
          <div className="bg-brand-50 dark:bg-blue-400/10 p-3 rounded-xl">
            <User className="h-6 w-6 text-brand dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Confirmar Dados do Cliente
          </h3>
        </div>

        {/* Reduce gap between grid items */}
        <div className="grid md:grid-cols-1 gap-2 mb-1">
          {/* Rest of form fields with reduced margin-top */}
          <div className="md:col-span-2">
            <label className={labelClass}>Nome*</label>
            <div className="mt-0.5 relative">
              <User className={iconClass} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email*</label>
            <div className="mt-0.5 relative">
              <Mail className={iconClass} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className={inputClass}
                required
              />
            </div>
          </div>


        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 flex items-center text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}


    </form>
  );
}
