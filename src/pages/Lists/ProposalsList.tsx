import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  Trash2,
  AlertCircle,
  X,
  Check,
  Edit
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {ProposalForm} from '../../components/ProposalForm';
import { usePlanos } from '../../hooks/usePlanos';
import { useAddons } from '../../hooks/useAddons';

interface Proposal {
  proposta_id: string;
  cliente_final_id: string;
  ava_ava_id: string;
  plano_outr_id: string;
  valor: number;
  status: string;
  dt_inicio: string;
  nome_empresa: string;
  email_empresa: string;
  cnpj: string;
}

export default function ProposalsList() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);

  const { planos, loading: planosLoading } = usePlanos();
  const { addons, loading: addonsLoading } = useAddons();

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('proposta_outr')
        .select(`
          proposta_id,
          cliente_final_id,
          ava_id,
          plano_outr_id,
          valor,
          status,
          dt_inicio,
          nome_empresa,
          email_empresa,
          cnpj
        `)
        .order('dt_inicio', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProposalId) return;

    try {
      const { error } = await supabase
        .from('outrpropostas')
        .delete()
        .eq('proposta_id', selectedProposalId);

      if (error) throw error;

      setProposals(prev => prev.filter(p => p.proposta_id !== selectedProposalId));
      setIsDeleteModalOpen(false);
      setSelectedProposalId(null);
    } catch (error) {
      console.error('Error deleting proposal:', error);
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = 
      proposal.nome_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.email_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.cnpj.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading || planosLoading || addonsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Propostas</h1>
        <button
          onClick={() => setIsFormOpen(true)}
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
                <option value="accepted">Aceitas</option>
                <option value="rejected">Recusadas</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  CNPJ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProposals.map((proposal) => (
                <tr key={proposal.proposta_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {proposal.nome_empresa}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {proposal.email_empresa}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {proposal.cnpj}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(proposal.valor)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      proposal.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : proposal.status === 'accepted'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {proposal.status === 'pending' && 'Pendente'}
                      {proposal.status === 'accepted' && 'Aceita'}
                      {proposal.status === 'rejected' && 'Recusada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(proposal.dt_inicio).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="group p-2 rounded-lg transition-all duration-200 hover:bg-orange-100 dark:hover:bg-orange-900/20 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-500/60 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                        <Edit className="h-5 w-5 text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors" />
                      </button>
                      {proposal.status === 'pending' && (
                        <button
                          onClick={() => {
                            setSelectedProposalId(proposal.proposta_id);
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
  );
}