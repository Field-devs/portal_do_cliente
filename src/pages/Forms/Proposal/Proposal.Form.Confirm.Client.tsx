import React, { useState } from 'react';
import { useAuth } from '../../../components/AuthProvider';
import { supabase } from '../../../lib/supabase';
import {
  Mail,
  User,
  Phone,
  Calendar,
  AlertCircle,
  Loader2,
  Save,
  UserCheck
} from 'lucide-react';
import CircularWait from '../../../components/CircularWait';
import Cliente from '../../../Models/Cliente';

interface CommercialAffiliateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  Tipo: string;
  sender : Cliente;
}

// Common CSS classes
const labelClass = "block text-sm font-medium text-black";
const inputClass = "pl-12 block w-full border border-gray-700/50 bg-white text-black focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors";
const iconGroupClass = "flex items-center space-x-3 mb-6";
const iconGroupTitleClass = "h-6 w-6 text-blue-400";
const iconInputClass = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

export default function ProposalFormConfirmClient({ Tipo, onCancel, sender }: CommercialAffiliateFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefix] = useState<string>("");
  


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  };


  return (
    loading ? <CircularWait message="Carregando..." small={true} /> :


      <div className="flex justify-center items-center mt-20">

        {/* Informacoes Basicas */}
        <div className="bg-white backdrop-blur-sm p-10 border border-gray-700/50">

          {/* Cabecalho 1 */}
          <div className={iconGroupClass}>
            <div className="bg-blue-400/10 p-3 rounded-xl">
              <UserCheck className={iconGroupTitleClass} />
            </div>
            <h3 className="text-lg font-medium text-blue-800">
              {Tipo == "EMP" ? 'Dados da Empresa' : 'Dados do Cliente'}
            </h3>
          </div>

          {/* CNPJ/Nome */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* CPF/CNPJ */}
            <div>
              <label className={labelClass}>
                CNPJ/CPF
              </label>
              <div className="mt-1 relative">
                <User className={iconInputClass} />
                <input
                  type="text"
                  name={prefix + "cnpjcpf"}
                  value={sender[prefix + "cnpjcpf"]}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Nome */}
            <div className="col-span-3">
              <label className={labelClass}>
                Nome
              </label>
              <div className="mt-1 relative">
                <User className={iconInputClass} />
                <input
                  type="text"
                  name={prefix + "nome"}
                  value={IsFinan ?  sender.fin_nome : sender.nome}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
            </div>


          </div>

          {/* Email/Fone/Nascimento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email */}
            <div>
              <label className={labelClass}>
                Email
              </label>
              <div className="mt-1 relative">
                <Mail className={iconInputClass} />
                <input
                  type="email"
                  name={prefix + "email"}
                  value={IsFinan ?  sender.fin_email : sender.email}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label className={labelClass}>
                Fone
              </label>
              <div className="mt-1 relative">
                <Phone className={iconInputClass} />
                <input
                  type="tel"
                  name={prefix + "fone"}
                  value={IsFinan ?  sender.fin_fone : sender.fone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  className={inputClass}
                  required
                />
              </div>
            </div>


          </div>


          {/* Endereco */}
          <div className="grid grid-cols-7 md:grid-cols-5 gap-6">
            {/* CEP */}
            <div className="col-span-1">
              <label className={labelClass}>
                CEP
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name={prefix + "cep"}
                  value={IsFinan ?  sender.fin_cep : sender.cep}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Logradouro */}
            <div className="col-span-3">
              <label className={labelClass}>
                Logradouro
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name={prefix + "logradouro"}
                  value={IsFinan ?  sender.fin_logradouro : sender.logradouro}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>


            {/* Numero */}
            <div className="col-span-1">
              <label className={labelClass}>
                nº
              </label>
              <div className="mt-1 relative">
                <input
                  type="number"
                  name={prefix + "numero"}
                  value={IsFinan ?  sender.fin_numero : sender.numero}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            {/* Bairro */}
            <div className="col-span-2">
              <label className={labelClass}>
                Bairro
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name={prefix + "bairro"}
                  value={IsFinan ?  sender.fin_bairro : sender.bairro}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Cidade / UF */}

            {/* Cidade */}
            <div className="col-span-2">
              <label className={labelClass}>
                Cidade
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name={prefix + "cidade"}
                  value={IsFinan ?  sender.fin_cidade : sender.cidade}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* UF */}
            <div>
              <label className={labelClass}>
                UF
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name={prefix + "uf"}
                  value={IsFinan ?  sender.fin_uf : sender.uf}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>

            </div>

            {/* Referencia */}
            <div className="col-span-5">
              <label className={labelClass}>
                Referencia
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  name={prefix + "referencia"}
                  value={IsFinan ?  sender.fin_referencia : sender.referencia}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>

            </div>

          </div>


        </div>



        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 flex items-center text-red-400">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

      </div >
  );
}