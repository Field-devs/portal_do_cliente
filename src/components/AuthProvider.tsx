import { createContext, useContext, useState, useEffect } from 'react';
import { authenticateUser } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { User } from '../Models/Uses';

type UserRole = 'super_admin' | 'admin' | 'ava_admin' | 'ava' | 'client';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Map perfil_id to role
      const roleMap: Record<number, UserRole> = {
        1: 'super_admin',
        2: 'admin',
        3: 'ava_admin',
        4: 'ava',
        5: 'client'
      };
      
      setRole(roleMap[parsedUser.perfil_id] || null);
      
      // If we're on the login page and have a valid session, redirect to portal
      if (window.location.pathname === '/login') {
        navigate('/portal');
      }
    } else if (window.location.pathname !== '/login' && 
               window.location.pathname !== '/forgot-password' && 
               window.location.pathname !== '/reset-password') {
      // If no session and not on auth pages, redirect to login
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const userData = await authenticateUser(email, password);
      setUser(userData);

      // Map perfil_id to role
      const roleMap: Record<number, UserRole> = {
        1: 'super_admin',
        2: 'admin',
        3: 'ava_admin',
        4: 'ava',
        5: 'client'
      };
      
      setRole(roleMap[userData.perfil_id] || null);
      console.log('User role:', role);
      // Store complete user data including profile photo
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/portal');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      setRole(null);
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    try {
      // Get current user data
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Update user data with new values
      const updatedUser = { ...storedUser, ...updates };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}