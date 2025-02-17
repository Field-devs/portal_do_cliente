import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { LogOut, User, Settings, Home, Users, FileText, CreditCard, Gift } from 'lucide-react';
import UserManagement from './Account/UserManagement';
import PlanManagement from './dashboard/PlanManagement';
import ProposalManagement from './dashboard/ProposalManagement';
import PaymentManagement from './dashboard/PaymentManagement';
import Profile from './dashboard/Profile';

interface DashboardProps {
  userType: 'admin' | 'ava_admin' | 'ava' | 'client' | 'affiliate';
}

export default function Dashboard({ userType }: DashboardProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'Users',
      icon: <Users className="h-5 w-5" />,
      path: 'users',
      show: ['admin', 'ava_admin'].includes(userType),
      component: <UserManagement userType={userType} />
    },
    {
      label: 'Plans',
      icon: <FileText className="h-5 w-5" />,
      path: 'plans',
      show: true,
      component: <PlanManagement userType={userType} />
    },
    {
      label: 'Proposals',
      icon: <Gift className="h-5 w-5" />,
      path: 'proposals',
      show: true,
      component: <ProposalManagement userType={userType} />
    },
    {
      label: 'Payments',
      icon: <CreditCard className="h-5 w-5" />,
      path: 'payments',
      show: true,
      component: <PaymentManagement userType={userType} />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Home className="h-6 w-6 text-blue-500" />
                <span className="ml-2 font-semibold text-gray-900">Dashboard</span>
              </Link>
              <div className="hidden md:flex ml-10 space-x-8">
                {menuItems.map((item) => 
                  item.show && (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Link>
                  )
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <User className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Settings className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <LogOut className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Routes>
            <Route
              path="/"
              element={
                <div className="bg-white rounded-lg shadow p-6">
                  <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h1>
                  <p className="text-gray-600">
                    You are logged in as {userType.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              }
            />
            {menuItems.map((item) => 
              item.show && (
                <Route
                  key={item.path}
                  path={item.path}
                  element={item.component}
                />
              )
            )}
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}