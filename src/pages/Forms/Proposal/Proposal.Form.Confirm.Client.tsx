import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../components/AuthProvider';
import {
  Mail,
  User,
  Phone,
  AlertCircle,
  UserCheck,
  Building2,
  CreditCard,
  MapPin
} from 'lucide-react';
import CircularWait from '../../../components/CircularWait';
import { Proposta } from '../../../Models/Propostas';

interface ProposalFormConfirmClientProps {
  onSuccess: () => void;
  onCancel: () => void;
  Tipo: string;
  sender: Proposta;
  setSender: React.Dispatch<React.SetStateAction<Proposta>>;
}

export default function ProposalFormConfirmClient({ Tipo, onCancel, sender, setSender }: ProposalFormConfirmClientProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefix, setPrefix] = useState<string>("");
  const [docType, setDocType] = useState<string>("");

  useEffect(() => {
    setPrefix(Tipo == "EMP" ? "emp_" : Tipo == "RES" ? "resp_" : "finan_");
    setDocType(Tipo == "EMP" ? "cnpj" : "cpf");
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSender({ ...sender, [name]: value });
  };

  const GetFieldName = (name: string) => {
    return prefix + name;
  };

  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputClass = "w-full pl-12 pr-4 py-3 bg-light-secondary dark:bg-[#0F172A]/60 border border-light-border dark:border-gray-700/50 text-light-text-primary dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors rounded-lg shadow-sm";
  const iconClass = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

  if (loading) {
    return <CircularWait message="Carregando..." small={true} />;
  }

  return (
    <div className={cardClass}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-400/10 p-3 rounded-xl">
          {Tipo === "EMP" ? (
            <Building2 className="h-6 w-6 text-brand dark:text-blue-400" />
          ) : (
            <UserCheck className="h-6 w-6 text-brand dark:text-blue-400" />
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {Tipo === "EMP" ? 'Dados da Empresa' : 
           Tipo === "RES" ? 'Responsável pela Empresa' : 
           'Responsável Financeiro'}
        </h3>
      </div>

      {/* Main Form */}
      <div className="space-y-6">
        {/* Document and Name */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className={labelClass}>
              {Tipo === "EMP" ? 'CNPJ' : 'CPF'}
            </label>
            <div className="relative">
              <CreditCard className={iconClass} />
              <input
                type="text"
                name={GetFieldName(docType)}
                value={sender[GetFieldName(docType)]}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className={labelClass}>Nome</label>
            <div className="relative">
              {Tipo === "EMP" ? (
                <Building2 className={iconClass} />
              ) : (
                <User className={iconClass} />
              )}
              <input
                type="text"
                name={GetFieldName("nome")}
                value={sender[GetFieldName("nome")]}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Email</label>
            <div className="relative">
              <Mail className={iconClass} />
              <input
                type="email"
                name={GetFieldName("email")}
                value={sender[GetFieldName("email")]}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Telefone</label>
            <div className="relative">
              <Phone className={iconClass} />
              <input
                type="tel"
                name={GetFieldName("fone")}
                value={sender[GetFieldName("fone")]}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Address Section - Only for Company */}
        {Tipo === "EMP" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className={labelClass}>CEP</label>
                <div className="relative">
                  <MapPin className={iconClass} />
                  <input
                    type="text"
                    name={GetFieldName("cep")}
                    value={sender[GetFieldName("cep")]}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="col-span-2 md:col-span-4">
                <label className={labelClass}>Logradouro</label>
                <div className="relative">
                  <MapPin className={iconClass} />
                  <input
                    type="text"
                    name={GetFieldName("logradouro")}
                    value={sender[GetFieldName("logradouro")]}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className={labelClass}>Número</label>
                <div className="relative">
                  <MapPin className={iconClass} />
                  <input
                    type="number"
                    name={GetFieldName("numero")}
                    value={sender[GetFieldName("numero")]}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Bairro</label>
                <div className="relative">
                  <MapPin className={iconClass} />
                  <input
                    type="text"
                    name={GetFieldName("bairro")}
                    value={sender[GetFieldName("bairro")]}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Cidade</label>
                <div className="relative">
                  <MapPin className={iconClass} />
                  <input
                    type="text"
                    name={GetFieldName("cidade")}
                    value={sender[GetFieldName("cidade")]}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>UF</label>
                <div className="relative">
                  <MapPin className={iconClass} />
                  <input
                    type="text"
                    name={GetFieldName("uf")}
                    value={sender[GetFieldName("uf")]}
                    onChange={handleInputChange}
                    className={inputClass}
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 flex items-center text-red-600 dark:text-red-400 rounded-lg">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}