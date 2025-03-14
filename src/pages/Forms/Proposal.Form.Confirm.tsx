import React, { useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabase';
import {
  Mail,
  User,
  Phone,
  Percent,
  DollarSign,
  Calendar,
  AlertCircle,
  Loader2,
  Save,
  UserCheck
} from 'lucide-react';
import { OUTR_BLACK_IMAGE_URL } from '../../utils/consts';

interface CommercialAffiliateFormProps {
  id : string;
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: {
    id: string;
    nome: string;
    email: string;
    fone: number;
    desconto: number;
    comissao: number;
    vencimento: string;
    active: boolean;
  };
}

// Common CSS classes
const labelClass = "block text-sm font-medium text-black";
const inputClass = "pl-12 block w-full border border-gray-700/50 bg-white text-black focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors";
const iconGroupClass = "flex items-center space-x-3 mb-6";
const iconGroupTitleClass = "h-6 w-6 text-blue-400";
const iconInputClass = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400";

export default function ProposalFormaConfirm({ id, onCancel, initialData }: CommercialAffiliateFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center items-center mt-20">

      <form onSubmit={handleSubmit} className="space-y-6 max-w-8xl" >
        {/* Cabecalho 1 */}
        <div className={iconGroupClass}>
          <img src={OUTR_BLACK_IMAGE_URL} alt="Logo" width="48" height="48" />
          <h4 className="text-2xl font-medium text-blue-800">
            CONFIRMAÇÃO DE PROPOSTA
          </h4>
        </div>


        {/* Informacoes Basicas */}
        <div className="bg-white backdrop-blur-sm p-10 border border-gray-700/50">

          {/* Cabecalho 1 */}
          <div className={iconGroupClass}>
            <div className="bg-blue-400/10 p-3 rounded-xl">
              <UserCheck className={iconGroupTitleClass} />
            </div>
            <h3 className="text-lg font-medium text-blue-800">
              Informações do Cliente
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
                  name="cnpj"
                  onChange={handleInputChange}
                  className={inputClass}
                  required
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
                  name="nome"
                  onChange={handleInputChange}
                  className={inputClass}
                  required
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
                  name="email"
                  onChange={handleInputChange}
                  className={inputClass}
                  required
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
                  name="telefone"
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className={labelClass}>
                Data de Nascimento
              </label>
              <div className="mt-1 relative">
                <Calendar className={iconInputClass} />
                <input
                  type="date"
                  name="nascimento"
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
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
                  name="cep"
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
                  name="logradouro"
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
                  name="numero"
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
                  name="bairro"
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
                  name="cidade"
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
                  name="uf"
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
                  name="referencia  "
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                />
              </div>

            </div>

          </div>


        </div>

        {/* Informacoes Basicas */}
        <div className="bg-white backdrop-blur-sm p-10 border border-gray-700/50">

          {/* Cabecalho 1 */}
          <div className={iconGroupClass}>
            <div className="bg-blue-400/10 p-3 rounded-xl">
              <UserCheck className={iconGroupTitleClass} />
            </div>
            <h3 className="text-lg font-medium text-blue-800">
            Responsável Financeiro
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
                  name="cnpj"
                  onChange={handleInputChange}
                  className={inputClass}
                  required
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
                  name="nome"
                  onChange={handleInputChange}
                  className={inputClass}
                  required
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
                  name="email"
                  onChange={handleInputChange}
                  className={inputClass}
                  required
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
                  name="telefone"
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
                  name="cep"
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
                  name="logradouro"
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
                  name="numero"
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
                  name="bairro"
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
                  name="cidade"
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
                  name="uf"
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
                  name="referencia  "
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

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-[#0F172A]/60 text-black hover:bg-[#0F172A]/40 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500/80 hover:bg-blue-600/80 text-white transition-colors flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {initialData ? 'Atualizar Afiliado' : 'Criar Afiliado'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}