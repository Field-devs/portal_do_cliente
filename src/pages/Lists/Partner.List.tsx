import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Building2,
  Users,
  UserCheck,
  Copy,
  CheckCircle,
  UserPlus,
  Plus
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CommercialAffiliateForm from '../Forms/CommercialAffiliateForm';
import { formatPhone } from '../../utils/formatters';
import SearchFilter from '../../components/SearchFilter';
import { ModalForm } from '../../components/Modal/Modal';
import ActionsButtons from '../../components/ActionsData';
import { UpdateSingleField } from '../../utils/supageneric';
import { format } from 'date-fns';
import CircularWait from '../../components/CircularWait';
import Cliente from '../../Models/Cliente';
import { UserRoles } from '../../utils/consts';
import { useAuth } from '../../components/AuthProvider';
import '../../Styles/animations.css';

export default function PartnerList() {
  const { user } = useAuth();
  const [tipo, setTipo] = useState<UserRoles>(UserRoles.CLIENTE_FINAL);
  const [title, setTitle] = useState('Cliente Final');
  const [client, setClient] = useState<Partner[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [showCopyTooltip, setShowCopyTooltip] = useState<string | null>(null);
  const [showAfilate, setShowAfilate] = useState<boolean>(false);
  const [IsAva, setIsAva] = useState(false);


  const cardClass = "bg-light-card dark:bg-[#1E293B]/90 backdrop-blur-sm p-6 shadow-lg border border-light-border dark:border-gray-700/50 rounded-lg";
  const titleClass = "text-4xl font-bold text-light-text-primary dark:text-white";

  useEffect(() => {
    let ISAVA = user?.perfil_cod === UserRoles.AVA || user?.perfil_cod === UserRoles.AVA_ADMIN ? true : false;
    setIsAva(ISAVA);
  }, []);



  useEffect(() => {
    fetchClientes();

    setTitle('');
    if (tipo === UserRoles.CLIENTE_FINAL) {
      setTitle('Clientes Finais');
    } else if (tipo === UserRoles.AVA) {
      setTitle('AVA');
    } else if (tipo === UserRoles.AFILIADO_COMERCIAL) {
      setTitle('Afiliados');
    }
  }, [tipo]);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('v_cliente')
        .select('*')
        .eq('f_perfil_cod', tipo)
        .order('id', { ascending: false });

      if (error) throw error;
      setClient(data || []);

    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async (couponCode: string) => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setShowCopyTooltip(couponCode);
      setTimeout(() => setShowCopyTooltip(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const filteredItems =
    client.filter(partner => {
      const matchesSearch =
        partner.emp_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.emp_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.cupom.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? partner.active : !partner.active);

      return matchesSearch && matchesStatus;
    });

  const handleClickNew = () => {
    setEditingPartner(null);
    setShowAfilate(true);
  };


  const handleOnLock = async (id: string, status: boolean): Promise<boolean> => {
    UpdateSingleField("cliente", "id", id, "active", !status);
    return true;
  };

  function handleEdit(value: Cliente): void {
    setEditingPartner(value);
    setShowAfilate(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircularWait message="Contas" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className={`${titleClass} title-fade-in`}>{title}</h1>
        {tipo == UserRoles.AFILIADO_COMERCIAL && IsAva == false && (
          <button
            onClick={() => handleClickNew()}
            className="flex items-center px-4 py-2 bg-brand hover:bg-brand/90 text-white transition-colors rounded-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            {tipo === UserRoles.AFILIADO_COMERCIAL ? 'Adicionar Afiliado' : 'Adicionar AVA'}
          </button>
        )}
      </div>

      {/* Search and Tabs */}
      <div className={cardClass}>
        <div className="flex flex-col space-y-6">
          {/* Tabs */}
          <div className="flex space-x-4">
            <button
              onClick={() => setTipo(UserRoles.CLIENTE_FINAL)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${tipo === UserRoles.CLIENTE_FINAL
                ? 'bg-brand text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#0F172A]/40'
                }`}
            >
              <Users className="h-5 w-5 mr-2" />
              Clientes Finais
            </button>

            {IsAva == false && (
              <>
                <button
                  onClick={() => setTipo(UserRoles.AVA)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${tipo === UserRoles.AVA
                    ? 'bg-brand text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#0F172A]/40'
                    }`}
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  AVAs
                </button>
                <button
                  onClick={() => setTipo(UserRoles.AFILIADO_COMERCIAL)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${tipo === UserRoles.AFILIADO_COMERCIAL
                    ? 'bg-brand text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#0F172A]/40'
                    }`}
                >
                  <UserCheck className="h-5 w-5 mr-2" />
                  Afiliados Comerciais
                </button>
              </>
            )}



          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <SearchFilter
              searchPlaceholder="Buscar por nome, email ou telefone..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filterOptions={[
                { value: 'all', label: 'Todos os Status' },
                { value: 'active', label: 'Ativos' },
                { value: 'inactive', label: 'Inativos' }
              ]}
              filterValue={statusFilter}
              onFilterChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`${cardClass} mt-12 overflow-hidden fade-in`} key={tipo}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-light-border dark:divide-gray-700/50 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-light-secondary dark:bg-[#0F172A]/60 rounded-t-lg">
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Telefone
                </th>
                {tipo === UserRoles.AFILIADO_COMERCIAL && (
                  <>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                      Cupom
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                      Taxas
                    </th>
                  </>
                )}
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-light-text-primary dark:text-gray-300 uppercase tracking-wider">

                </th>
              </tr>
            </thead>


            <tbody className="divide-y divide-light-border dark:divide-gray-700/50">
              {filteredItems.map((item) => {
                // console.log(item); // Log the item object here
                return (
                  <tr
                    key={item.id}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base font-medium text-light-text-primary dark:text-gray-100">
                        {item.emp_nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {item.emp_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {formatPhone(item.emp_fone?.toString())}
                      </div>
                    </td>
                    {tipo === UserRoles.AFILIADO_COMERCIAL && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <button
                              onClick={() => handleCopyToClipboard(item.cupom)}
                              className="group px-3 py-1.5 inline-flex items-center space-x-2 text-sm leading-5 font-medium rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 border border-brand-200 dark:border-brand-700/30 transition-colors"
                            >
                              <span>{item.cupom}</span>
                              <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            {showCopyTooltip === item.cupom && (
                              <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="h-3 w-3" />
                                  <span>Copiado!</span>
                                </div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base text-light-text-secondary dark:text-gray-300">
                            <div>Desconto: {item.desconto}%</div>
                            <div>Comissão: {item.comissao}%</div>
                          </div>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base text-light-text-secondary dark:text-gray-300">
                        {format(new Date(item?.dt_add), 'dd/MM/yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">

                      <ActionsButtons
                        onLocker={async () => handleOnLock(item.id, item.active)}
                        // onEdit={() => { item.tipo == UserRoles.AFILIADO_COMERCIAL? handleEdit(item) : null }}
                        onEdit={() => handleEdit(item)}
                        active={item.active}
                      />
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

      {/* Commercial Affiliate Form Modal */}
      <ModalForm
        isOpen={showAfilate}
        onClose={() => setShowAfilate(false)}
        icon={<>{<UserPlus className="h-5 w-5" />}</>}
        maxWidth="2xl"
      >

        <CommercialAffiliateForm
          initialData={editingPartner}
          onSuccess={() => {
            setShowAfilate(false);
            setEditingPartner(null);
            fetchClientes();
          }}
          onCancel={() => {
            setShowAfilate(false);
            setEditingPartner(null);
          }}

        />

      </ModalForm>



    </div>
  );
}