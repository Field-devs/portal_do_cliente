import { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { useTheme } from '../components/ThemeProvider';
import {
  FileText,
  Users,
  Wallet,
  LogOut,
  Package,
  FileCheck2,
  Briefcase,
  Moon,
  Sun,
  BarChart2,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Cog
} from 'lucide-react';
import AdminDashboard from './dashboard/AdminDashboard';
import ProposalsList from './Lists/Proposals.List';
import PartnerList from './Lists/Partner.List';
import AccountList from './Account/AccountList';
import FinancialDashBoard from './dashboard/FinancialDashBoard';
import PlanList from './Lists/Plan.List';
import Profile from './Account/Profile';
import SignatureList from './Lists/Signature.List';
import ProposalFormConfirm from './Forms/Proposal/Proposal.Form.Confirm';

const getRoleBadgeStyles = (role: string | null) => {
  switch (role) {
    case 'super_admin':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'admin':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'client':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'ava':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'ava_admin':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
};


export default function Portal() {
  const { user, profile: role, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const navigation = [
    { id: 1, name: 'Dashboard', icon: BarChart2, path: '/portal', visible: [1] },
    { id: 2, name: 'Propostas', icon: FileText, path: '/portal/proposals', visible: [1, 2, 3, 4] },
    { id: 3, name: 'Assinaturas', icon: FileCheck2, path: '/portal/signature', visible: [1, 2, 3, 4] },
    { id: 4, name: 'Planos/Addons', icon: Package, path: '/portal/plans', visible: [1, 2, 3, 4] },
    { id: 5, name: 'Contas', icon: Briefcase, path: '/portal/partners', visible: [1, 2, 3, 4] },
    { id: 6, name: 'Usuários', icon: Users, path: '/portal/accounts', visible: [1, 2] },
    { id: 7, name: 'Financeiro', icon: Wallet, path: '/portal/financial', visible: [1, 2, 3, 4, 5] }
  ];

  const logoUrl = theme === 'dark'
    ? "https://storage.wiseapp360.com/typebot/public/workspaces/clwl6fdyf000511ohlamongyl/typebots/cm683siyl000dm4kxlrec9tb8/results/hkmdaw6c6ice8z349zj22v4i/blocks/cz78pvc8stcisz1y8sq2khj1/OutrVertical.png"
    : "https://storage.wiseapp360.com/typebot/public/workspaces/clwl6fdyf000511ohlamongyl/typebots/cm683siyl000dm4kxlrec9tb8/results/jctueeexledouxj5ys19vnq9/blocks/cz78pvc8stcisz1y8sq2khj1/VerticalBlack.png";

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary flex">
      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 bg-light-card dark:bg-dark-card shadow-lg transition-all duration-300 z-20 flex flex-col border-r border-light-border dark:border-dark-border backdrop-blur-sm rounded-tr-2xl rounded-br-2xl ${isExpanded ? 'w-52' : 'w-20'}`}>
        {/* Logo and Toggle */}
        <div className="h-16 flex items-center justify-between px-3 border-b border-light-border dark:border-dark-border">
          <img
            src={logoUrl}
            alt="OUTR.ONE"
            className={`transition-all duration-300 ${isExpanded ? 'h-8 w-auto' : 'h-8 w-8 object-cover'}`}
          />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-light-secondary dark:hover:bg-dark-secondary"
          >
            {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>

        {/* User Profile */}
        <div className="p-3 border-b border-light-border dark:border-dark-border">
          <div className="flex flex-col items-center">
            {user?.foto ? (
              <img
                src={user.foto}
                alt={user.nome}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-100 dark:ring-brand-900"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 flex items-center justify-center ring-2 ring-brand-100 dark:ring-brand-900">
                <span className="text-lg font-medium">{user?.nome?.charAt(0) || '-'}</span>
              </div>
            )}
            {isExpanded && (
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.nome || '-'}
                </p>
                <div className={`inline-flex px-2 py-0.5 mt-1 text-xs font-medium rounded-md ${getRoleBadgeStyles(role)}`}>
                  {user?.perfil_nome}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            if (item.visible && !item.visible.includes(user?.perfil_id)) return null;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={!isExpanded ? item.name : undefined}
                className={`flex items-center px-3 py-2 mx-2 text-sm font-medium rounded-lg transition-colors ${isExpanded ? 'justify-start' : 'justify-center'} ${isActive
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 hover:text-brand-600 dark:hover:text-brand-400'
                  }`}
              >
                <div className={isExpanded ? '' : 'min-w-[2rem] flex justify-center'}>
                  <item.icon className="h-5 w-5" />
                </div>


                {isExpanded && (
                  <span className="ml-3 truncate">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-light-border dark:border-dark-border">
          <div className={`flex ${isExpanded ? 'flex-row justify-center space-x-2' : 'flex-col items-center space-y-2'}`}>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-light-secondary dark:hover:bg-dark-secondary"
              title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-light-secondary dark:hover:bg-dark-secondary"
              title={'Configurações do Sistema'}
            >
              <Cog className="h-5 w-5" />
            </button>

            <NavLink
              to="/portal/profile"
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-light-secondary dark:hover:bg-dark-secondary"
              title="Perfil"
            >
              <UserCircle className="h-5 w-5" />
            </NavLink>

            <button
              onClick={signOut}
              className="p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isExpanded ? 'ml-52' : 'ml-20'}`}>
        <div className="p-6">
          <Routes>
            {/* <Route path="/" element={<AdminDashboard />} /> */}
            <Route path="/" element={<AdminDashboard />} />
            <Route path="signature" element={<SignatureList />} />
            <Route path="plans" element={<PlanList />} />
            <Route path="proposals" element={<ProposalsList />} />
            <Route path="partners" element={<PartnerList />} />
            <Route path="accounts" element={<AccountList />} />
            <Route path="financial" element={<FinancialDashBoard />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
