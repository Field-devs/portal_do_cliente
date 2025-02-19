import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { User } from '../Models/Uses';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type UserRole = 'super_admin' | 'admin' | 'ava_admin' | 'ava' | 'client';

const authenticateUser = async (email: string, password: string) => {
  try {

    // Get user from database first to check if they exist
    const { data: userData, error: userError } = await supabase
      .from('v_users')
      .select('*')
      .eq('email', email)
      .eq('active', true)
      .single();

    if (userError) {
      console.error('Database error:', userError);
      throw new Error('Usuário não encontrado');
    }

    if (!userData) {
      throw new Error('Usuário não encontrado');
    }

    // Then authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    let userDataModify : User = {
      // Auth
      user_id: authData.user?.id,
      aud: authData.user?.aud,
      role: authData.user?.role,
      email_confirmed_at: authData.user?.email_confirmed_at,
      phone: authData.user?.phone,
      is_anonymous: authData.user?.is_anonymous,

      // Usuario
      id: userData.id,
      email: userData.email,
      nome: userData.nome || '',
      empresa: userData.empresa || '',
      cnpj: userData.cnpj || '',
      perfil_id: userData.perfil_id,
      perfil_nome: userData.perfil_nome,
      fone: userData.telefone?.toString() || null,
      foto: userData.foto_perfil || null,
      f_status: userData.f_status,
      DateCreate: userData.dt_add,
      active: userData.active
    };

    localStorage.setItem('user', JSON.stringify(userDataModify));


    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Credenciais inválidas');
    }

    // Return complete user data
    return userDataModify;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

const registerUser = async (email: string, password: string) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });
    if (authError) {
      console.error('Sign up error:', authError);
      throw new Error('Erro ao registrar usuário');
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
export { authenticateUser, registerUser };

