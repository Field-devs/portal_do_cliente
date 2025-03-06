import React, { useState } from 'react';
import { X, DollarSign, Calendar, AlertCircle, Loader2, CreditCard, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  invoice: {
    id: string;
    valor: number;
    cliente_nome: string;
  };
  onClose: () => void;
  onSubmit: (paymentData: {
    amount: number;
    date: string;
    method: string;
    reference: string;
  }) => Promise<void>;
}

export default function PaymentModal({ invoice, onClose, onSubmit }: PaymentModalProps) {
  const [amount, setAmount] = useState(invoice.valor);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('pix');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        amount,
        date,
        method,
        reference
      });
      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1E293B]/90 backdrop-blur-sm border border-gray-700/50 p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-400/10 p-3 rounded-xl">
              <CreditCard className="h-6 w-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Registrar Pagamento
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-400/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-white">
              Pagamento Registrado!
            </h3>
            <p className="text-gray-300">
              O pagamento foi registrado com sucesso.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <div className="bg-[#0F172A]/60 p-6 border border-gray-700/50">
              <label className="block text-sm font-medium text-gray-300">
                Cliente
              </label>
              <p className="mt-1 text-lg font-medium text-white">
                {invoice.cliente_nome}
              </p>
            </div>

            {/* Payment Details */}
            <div className="bg-[#0F172A]/60 p-6 border border-gray-700/50 space-y-4">
              <h3 className="text-lg font-medium text-white mb-4">
                Detalhes do Pagamento
              </h3>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Valor
                </label>
                <div className="mt-1 relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="pl-12 block w-full border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Payment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Data do Pagamento
                </label>
                <div className="mt-1 relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-12 block w-full border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Método de Pagamento
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="mt-1 block w-full border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
                  required
                >
                  <option value="pix">PIX</option>
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="bank_transfer">Transferência Bancária</option>
                  <option value="boleto">Boleto</option>
                </select>
              </div>

              {/* Payment Reference */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Referência do Pagamento
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ex: Número da transação, identificador do pagamento"
                  className="mt-1 block w-full border border-gray-700/50 bg-[#0F172A]/60 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-colors"
                />
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
                onClick={onClose}
                className="px-4 py-2 bg-[#0F172A]/60 text-gray-300 hover:bg-[#0F172A]/40 transition-colors"
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
                    Processando...
                  </>
                ) : (
                  'Confirmar Pagamento'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}