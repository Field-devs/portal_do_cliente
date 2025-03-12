import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProposalFormConfirm() {
  const { id } = useParams();
  const [proposalData, setProposalData] = useState<any>(null);

  useEffect(() => {
    // Fetch data based on ID (replace with your actual API call)
    const fetchData = async () => {
      try {
        // const response = await fetch(`/api/proposals/${id}`);
        // const data = await response.json();
        // setProposalData(data);
        // Mock data for testing
        setProposalData({
          plano_nome: "Plano Premium",
          nome: "John Doe",
          email: "john.doe@example.com",
          nasc: "1990-01-01",
          fone: "123-456-7890",
          endereco: "123 Main St",
          cnpjcpf: "12345678901234",
          nome_finan: "Jane Doe",
          fone_finan: "098-765-4321",
          email_finan: "jane.doe@example.com",
          endereco_finan: "456 Elm St",
          cnpj_cpf_finan: "43210987654321",
          caixas_entrada_qtde: 5,
          atendentes_qtde: 3,
          automacoes_qtde: 2,
          kanban: true,
          suporte_humano: false,
          whatsapp_oficial: true,
          subtotal: 1000.00,
          desconto: 100.00,
          total_addons: 200.00,
          total: 1100.00,
          validade: 1,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!proposalData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Confirmação de Cadastro</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Plano:</label>
          <p>{proposalData.plano_nome}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
          <p>{proposalData.nome}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p>{proposalData.email}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Data de Nascimento:</label>
          <p>{proposalData.nasc}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Telefone:</label>
          <p>{proposalData.fone}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Endereço:</label>
          <p>{proposalData.endereco}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">CNPJ/CPF:</label>
          <p>{proposalData.cnpjcpf}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Responsável Financeiro:</label>
          <p>{proposalData.nome_finan}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Telefone Financeiro:</label>
          <p>{proposalData.fone_finan}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email Financeiro:</label>
          <p>{proposalData.email_finan}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Endereço Financeiro:</label>
          <p>{proposalData.endereco_finan}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">CNPJ/CPF Financeiro:</label>
          <p>{proposalData.cnpj_cpf_finan}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Caixas de Entrada:</label>
          <p>{proposalData.caixas_entrada_qtde}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Atendentes:</label>
          <p>{proposalData.atendentes_qtde}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Automações:</label>
          <p>{proposalData.automacoes_qtde}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Kanban:</label>
          <p>{proposalData.kanban ? "Sim" : "Não"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Suporte Humano:</label>
          <p>{proposalData.suporte_humano ? "Sim" : "Não"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">WhatsApp Oficial:</label>
          <p>{proposalData.whatsapp_oficial ? "Sim" : "Não"}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Subtotal:</label>
          <p>{proposalData.subtotal}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Desconto:</label>
          <p>{proposalData.desconto}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Total Addons:</label>
          <p>{proposalData.total_addons}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Total:</label>
          <p>{proposalData.total}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Validade:</label>
          <p>{proposalData.validade}</p>
        </div>
      </div>
    </div>
  );
}
