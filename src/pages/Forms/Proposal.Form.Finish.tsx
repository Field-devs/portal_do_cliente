import React, { useState } from "react";
import { CheckCircle, Mail, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProposalFormFinish({id}: { id: string }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const buttonClass = "px-4 py-2 flex items-center justify-center rounded-lg text-sm font-medium transition-colors";


  const copyToClipboard = async () => {
    try {
      const url = window.location.href.replace('/portal/proposals', '') + `/confirmation/${id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Cadastro Efetuado com Sucesso!
        </h1>

        <div className="space-y-4 text-gray-600">
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Mail className="w-5 h-5" />
            <p>O Cliente receberá instruções no seu E-mail</p>
          </div>

          <p>
            O Cliente receberá em instantes um email com as instruções de pagamento.
            Após efetuar o mesmo, seus dados de acesso serão liberados.
          </p>
        </div>

        <div className="flex justify-center pt-6">
          <button
            type="button"
            onClick={copyToClipboard}
            className={`${buttonClass} ${copied ? 'bg-green-50 text-green-600' : 'bg-brand text-white hover:bg-brand/90'}`}
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
        </div>

        {/* <div className="space-y-2"></div>
        <button
          onClick={() => navigate("/")}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Voltar para lista de propostas
        </button> */}

      </div>
    </div>
  );
}