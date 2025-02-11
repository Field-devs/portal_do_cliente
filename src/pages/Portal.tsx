import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { useTheme } from '../components/ThemeProvider';
import { 
  FileText, 
  Users, 
  Building2, 
  User,
  Wallet,
  LogOut,
  Home,
  ChevronRight,
  ChevronLeft,
  Package,
  Briefcase,
  Moon,
  Sun,
  Settings,
  BarChart2,
  UserCircle
} from 'lucide-react';
import AdminDashboard from './dashboard/AdminDashboard';
import ProposalsManagement from './dashboard/ProposalsManagement';
import PartnersManagement from './dashboard/PartnersManagement';
import AccountManagement from './dashboard/AccountManagement';
import FinancialControl from './dashboard/FinancialControl';
import Products from './dashboard/Products';
import Profile from './Profile';

const getRoleBadgeStyles = (role: string | null) => {
  switch (role) {
    case 'super_admin':
      return 'border-[#FFD700] bg-[#FFF8DC] text-[#DAA520] dark:border-[#FFD700] dark:bg-[#2A2000] dark:text-[#FFD700]';
    case 'admin':
      return 'border-[#1E90FF] bg-[#F0F8FF] text-[#1E90FF] dark:border-[#1E90FF] dark:bg-[#002952] dark:text-[#60A5FA]';
    case 'client':
      return 'border-[#32CD32] bg-[#F0FFF0] text-[#32CD32] dark:border-[#32CD32] dark:bg-[#002800] dark:text-[#4ADE4A]';
    case 'ava':
      return 'border-[#9370DB] bg-[#F8F4FF] text-[#9370DB] dark:border-[#9370DB] dark:bg-[#2A1A52] dark:text-[#B794F4]';
    case 'ava_admin':
      return 'border-[#FF69B4] bg-[#FFF0F5] text-[#FF69B4] dark:border-[#FF69B4] dark:bg-[#520025] dark:text-[#FF85C8]';
    default:
      return 'border-gray-300 bg-gray-50 text-gray-600 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getRoleDisplayName = (role: string | null) => {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    case 'client':
      return 'Cliente';
    case 'ava':
      return 'AVA';
    case 'ava_admin':
      return 'AVA Admin';
    default:
      return role || 'Usuário';
  }
};

export default function Portal() {
  const { user, role, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isNavExpanded, setIsNavExpanded] = useState(true);

  const navigation = [
    { name: 'Dashboard', icon: BarChart2, path: '/portal' },
    { name: 'Produtos', icon: Package, path: '/portal/products' },
    { name: 'Propostas', icon: FileText, path: '/portal/proposals' },
    { name: 'Negócios', icon: Briefcase, path: '/portal/partners' },
    { name: 'Usuários', icon: Users, path: '/portal/accounts' },
    { name: 'Financeiro', icon: Wallet, path: '/portal/financial' }
  ];

  const logoUrl = theme === 'dark' 
    ? "https://storage.wiseapp360.com/typebot/public/workspaces/clwl6fdyf000511ohlamongyl/typebots/cm683siyl000dm4kxlrec9tb8/results/n9bnrhtkc6gqstpe4ycafw87/blocks/flm69ulnpr4b67h01xj47t14/OutrVertical.png"
    : "https://storage.wiseapp360.com/typebot/public/workspaces/clwl6fdyf000511ohlamongyl/typebots/cm683siyl000dm4kxlrec9tb8/results/p3d7c6ik7c9873de0uh7k59j/blocks/flm69ulnpr4b67h01xj47t14/VerticalBlack.png";

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary flex">
      {/* Sidebar Navigation */}
      <div 
        className={`fixed inset-y-0 left-0 bg-light-secondary dark:bg-dark-secondary shadow-lg transition-all duration-300 z-20 ${
          isNavExpanded ? 'w-72' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <img
              src={logoUrl}
              alt="OUTR.ONE"
              className={`h-8 ${!isNavExpanded && 'w-8 object-cover'}`}
            />
            <button
              onClick={() => setIsNavExpanded(!isNavExpanded)}
              className="p-1 rounded-md text-brand dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isNavExpanded ? (
                <ChevronLeft className="h-6 w-6" />
              ) : (
                <ChevronRight className="h-6 w-6" />
              )}
            </button>
          </div>
          
          <nav className="flex-1 pt-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-700 text-brand dark:text-white'
                      : 'text-brand dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-brand dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isNavExpanded ? 'mr-3' : 'mx-auto'}`} />
                  {isNavExpanded && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex items-center w-full text-brand dark:text-gray-300 hover:text-brand dark:hover:text-white ${
                isNavExpanded ? 'justify-start' : 'justify-center'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              {isNavExpanded && <span className="ml-3">Tema {theme === 'dark' ? 'Claro' : 'Escuro'}</span>}
            </button>

            {/* Profile Link */}
            <NavLink
              to="/portal/profile"
              className={`flex items-center w-full text-brand dark:text-gray-300 hover:text-brand dark:hover:text-white ${
                isNavExpanded ? 'justify-start' : 'justify-center'
              }`}
            >
              <UserCircle className="h-5 w-5" />
              {isNavExpanded && <span className="ml-3">Perfil</span>}
            </NavLink>

            {/* Logout Button */}
            <button
              onClick={signOut}
              className={`flex items-center w-full text-brand dark:text-gray-300 hover:text-brand dark:hover:text-white ${
                isNavExpanded ? 'justify-start' : 'justify-center'
              }`}
            >
              <LogOut className="h-5 w-5" />
              {isNavExpanded && <span className="ml-3">Sair</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isNavExpanded ? 'ml-72' : 'ml-20'}`}>
        {/* Top Bar */}
        <div className="bg-light-secondary dark:bg-dark-secondary shadow-sm px-4 py-4">
          <div className="flex justify-end items-center space-x-4">
            <div className="flex items-center space-x-4">
              {/* Profile Photo and Info */}
              <div className="flex items-center space-x-3">
                {user?.foto_perfil ? (
                  <img
                    src={user.foto_perfil}
                    alt={user?.nome?.charAt(0) || '-'}
                    className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-700"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-brand text-white flex items-center justify-center border-2 border-white dark:border-gray-700">
                    <span className="text-sm font-medium">{user?.nome?.charAt(0) || '-'}</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-brand dark:text-white">{user?.nome || '-'}</p>
                  <div className={`px-2 py-0.5 text-xs font-semibold rounded-md ${getRoleBadgeStyles(role)}`}>
                    {getRoleDisplayName(role)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="proposals" element={<ProposalsManagement />} />
            <Route path="partners" element={<PartnersManagement />} />
            <Route path="accounts" element={<AccountManagement />} />
            <Route path="financial" element={<FinancialControl />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}