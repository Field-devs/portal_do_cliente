import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Proposta = Database['public']['Tables']['outrpropostas']['Row'];

export function usePropostas() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPropostas();
  }, []);

  async function fetchPropostas() {
    try {
      const { data, error } = await supabase
        .from('proposta_outr')
        .select('*')
        .order('dt_inicio', { ascending: false });

      if (error) throw error;
      setPropostas(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar propostas'));
    } finally {
      setLoading(false);
    }
  }

  async function createProposta(proposta: Omit<Database['public']['Tables']['outrpropostas']['Insert'], 'id' | 'dt_inicio' | 'status'>) {
    try {
      const { data, error } = await supabase
        .from('proposta_outr')
        .insert([{ 
          ...proposta,
          status: 'pending',
          dt_inicio: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      setPropostas(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao criar proposta');
    }
  }

  async function deleteProposta(id: string) {
    try {
      const { error } = await supabase
        .from('proposta_outr')
        .delete()
        .eq('proposta_id', id);

      if (error) throw error;
      setPropostas(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao excluir proposta');
    }
  }

  return {
    propostas,
    loading,
    error,
    createProposta,
    deleteProposta,
    refreshPropostas: fetchPropostas
  };
}