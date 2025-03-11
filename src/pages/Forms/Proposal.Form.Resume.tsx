import { useState } from "react";
import FormProps from "../../Models/FormProps";
import { User, Copy, X, CheckCircle, MapPin, Calendar, AlertCircle, Save, Phone, Mail } from 'lucide-react';
import { Proposta } from "../../Models/Propostas";

export default function ProposalFormResume({ onSuccess, sender, onClose }: FormProps) {
  const [proposta] = useState<Proposta>(sender);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState('');
  const [copied, setCopied] = useState(false);
  
  console.log(proposta);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatDocument = (value: string) => {
    // Remove any non-digit characters
    const numbers = value.replace(/\D/g, '');

    // Format based on length (CPF or CNPJ)
    if (numbers.length <= 11) {
      // CPF format: 000.000.000-00
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ format: 00.000.000/0000-00
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
  const buttonClass = "flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors";

  return (
    <div className="space-y-4">
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-50 dark:bg-blue-400/10 p-3 rounded-xl">
              <User className="h-6 w-6 text-brand dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Resumo da Proposta
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-b border-gray-200 dark:border-gray-700/50 pb-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Plano Escolhido</h4>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{0}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{"--"}</p>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700/50 pb-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Valor</h4>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(0)}
            </p>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={copyToClipboard}
              className={`${buttonClass} ${copied ? 'bg-green-50 text-green-600' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'} dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300`}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Link
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onSuccess}
              className={`${buttonClass} bg-brand text-white hover:bg-brand-600`}
            >
              Concluir
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}
