import React from "react";
import { CheckCircle, CircleSlash, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProposalFinishError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CircleSlash className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
           Proposta selecionada inexistente, cancelada ou já foi confirmada!
        </h1>

        <div className="space-y-4 text-gray-600">
          <p>
          O sistema não conseguiu acessar a proposta através do link fornecido. Por favor, verifique o link e tente novamente.
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