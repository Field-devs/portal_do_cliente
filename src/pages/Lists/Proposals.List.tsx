import { useState, useEffect } from 'react';
import Proposta from '../../Models/Propostas';
import { formatPhone, formatCNPJCPF } from '../../utils/formatters';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePlanos } from '../../hooks/usePlanos';
import { useAddons } from '../../hooks/useAddons';
import { ModalForm } from '../../components/Modal/Modal';
import ProposalForm from '../Forms/ProposalForm';


export default function ProposalsList() {
  const [openForm, setOpenForm] = useState(false);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [OpenProposal, setOpenProposal] = useState(false);

  const { loading: planosLoading } = usePlanos();
  const { loading: addonsLoading } = useAddons();


  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('v_proposta')
        .select('*')
        .order('dt', { ascending: false });

      if (error) throw error;
      setPropostas(data || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };


  const HandleOpenProposal = () => {
    setOpenProposal(true);
  };

  const filteredProposals = propostas.filter(() => {
    //const matchesSearch =
    //  proposal.nome.includes(searchTerm.toLowerCase()) ||
    //  proposal.email.includes(searchTerm.toLowerCase()) ||
    //  proposal.cnpj.includes(searchTerm);
    //const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    //return matchesSearch && matchesStatus;
    return propostas;
  });

  if (loading || planosLoading || addonsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }



  return (
    <>

      <ModalForm
        isOpen={OpenProposal}
        onClose={() => setOpenProposal(false)}
        title="Propostas"
        maxWidth='lg'
        
        children={<ProposalForm />}
      />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Propostas</h1>
          <button
            onClick={() => HandleOpenProposal()}
            className="flex items-center px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Proposta
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por empresa, email ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'accepted' | 'rejected')}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendentes</option>
                  <option value="accepted">Aceitas (Não Pagas)</option>
                  <option value="aproved">Aprovadas (Pagas)</option>
                  <option value="rejected">Recusadas</option>
                  <option value="expired">Expiradas</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[100px]">
                    Data
                  </th>

                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[100px]">
                    CNPJ/CPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cliente
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[50px]">
                    Email
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[50px]">
                    Fone
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[50px]">
                    Validade
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[50px]">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider  w-[50px]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[50px]">
                  </th>
                </tr>
              </thead>


              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProposals.map((proposta) => (
                  <tr key={proposta.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(proposta.dt).toLocaleDateString('pt-BR')}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatCNPJCPF(proposta.cnpj)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {proposta.nome}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {proposta.email}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatPhone(proposta.fone)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900 dark:text-white font-medium">
                        {proposta.validade} {proposta.validade === 1 ? 'Dia' : 'Dias'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(proposta.total)}
                      </span>
                    </td>


                    <td className="px-8 py-4 whitespace-nowrap">
                      <span className=
                        {
                          `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${proposta.status === 'PE'
                            ? 'justify-center bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 w-[100%]'
                            : proposta.status === 'AC'
                              ? 'justify-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 w-[100%]'
                              : 'justify-center bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 w-[100%]'
                          }`}>
                        {proposta.status_title}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button className="group p-2 rounded-lg transition-all duration-200 hover:bg-orange-100 dark:hover:bg-orange-900/20 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-500/60 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                          <Edit className="h-5 w-5 text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors" />
                        </button>
                        {proposta.status === 'PE' && (
                          <button
                            onClick={() => {
                              setSelectedProposalId(proposta.id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </>
  );
}