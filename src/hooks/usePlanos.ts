import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Plan from '../Models/Plan';


export function usePlanos() {
  const [planos, setPlanos] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPlanos();
  }, []);

  async function fetchPlanos() {
    try {
      const { data, error } = await supabase
        .from('plano')
        .select('*')
        .eq('active', true)
        .order('valor', { ascending: true });

      if (error) throw error;
      setPlanos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar planos'));
    } finally {
      setLoading(false);
    }
  }



  return {
    planos,
    loading,
    error,
    refreshPlanos: fetchPlanos
  };
}