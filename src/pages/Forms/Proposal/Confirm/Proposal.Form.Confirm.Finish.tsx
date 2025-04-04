import React from "react";
import { CheckCircle, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegistrationSuccess() {
  const navigate = useNavigate();

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
            <p>Aguarde instruções no seu email</p>
          </div>
          
          <p>
            Você receberá em instantes um email com as instruções de pagamento.
            Após efetuar o mesmo, seus dados de acesso serão liberados.
          </p>
        </div>

        <button
            onClick={() => navigate("/")}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Voltar para Home
        </button>
      </div>
    </div>
  );
}