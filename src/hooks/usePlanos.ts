import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { useAuth } from '../components/AuthProvider';

type Plano = Database['public']['Tables']['plano_outr']['Row'];

export function usePlanos() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchPlanos();
  }, []);

  async function fetchPlanos() {
    try {
      const { data, error } = await supabase
        .from('plano_outr')
        .select('*')
        .eq('status', true)
        .order('valor', { ascending: true });

      if (error) throw error;
      setPlanos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar planos'));
    } finally {
      setLoading(false);
    }
  }

  async function createPlano(plano: Omit<Database['public']['Tables']['plano_outr']['Insert'], 'id' | 'dt_criacao' | 'status'>) {
    if (!user?.pessoas_id) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { data, error } = await supabase
        .from('plano_outr')
        .insert([{ 
          ...plano,
          status: true,
          user_user_id: user.pessoa_id
        }])
        .select()
        .single();

      if (error) throw error;
      setPlanos(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao criar plano');
    }
  }

  async function updatePlano(id: string, updates: Database['public']['Tables']['plano_outr']['Update']) {
    try {
      const { data, error } = await supabase
        .from('plano_outr')
        .update(updates)
        .eq('plano_outr_id', id)
        .select()
        .single();

      if (error) throw error;
      setPlanos(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao atualizar plano');
    }
  }

  return {
    planos,
    loading,
    error,
    createPlano,
    updatePlano,
    refreshPlanos: fetchPlanos
  };
}