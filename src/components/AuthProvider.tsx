import { createContext, useContext, useState, useEffect } from 'react';
import { authenticateUser, supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { User } from '../Models/Uses';
import Profile from '../Models/Perfil';
import { AskDialog, ErrorDialog } from './Dialogs/Dialogs';


interface AuthContextType {
  user: User | null;
  profile: Profile[] | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
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
      
      // Store complete user data including profile photo
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/portal');
    } catch (error) {
      //console.error('Sign in error:', error);
      ErrorDialog('Credenciais inválidas', 'Erro ao fazer login');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if ((await AskDialog('Deseja realmente sair da Aplicação ?', 'Sair')).isConfirmed) {
        localStorage.removeItem('user');
        setUser(null);
        setProfile(null);
        navigate('/login');
      }
    } catch (error) {
      ErrorDialog('Erro ao sair da aplicação', 'Erro');
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
    <AuthContext.Provider value={{ user, profile: profile, loading, signIn, signOut, updateUser }}>
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