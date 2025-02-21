import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Addon = Database['public']['Tables']['addon']['Row'];

export function useAddons() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAddons();
  }, []);

  async function fetchAddons() {
    try {
      const { data, error } = await supabase
        .from('addon')
        .select('*')
        .eq('status', true)
        .order('valor', { ascending: true });

      if (error) throw error;
      setAddons(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar add-ons'));
    } finally {
      setLoading(false);
    }
  }

  async function createAddon(addon: Omit<Database['public']['Tables']['addon']['Insert'], 'id' | 'dt_add' | 'status'>) {
    try {
      const { data, error } = await supabase
        .from('addon')
        .insert([{ ...addon, status: true }])
        .select()
        .single();

      if (error) throw error;
      setAddons(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao criar add-on');
    }
  }

  async function updateAddon(id: string, updates: Database['public']['Tables']['addon']['Update']) {
    try {
      const { data, error } = await supabase
        .from('addon')
        .update(updates)
        .eq('addon_id', id)
        .select()
        .single();

      if (error) throw error;
      setAddons(prev => prev.map(a => a.id === id ? data : a));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erro ao atualizar add-on');
    }
  }

  return {
    addons,
    loading,
    error,
    createAddon,
    updateAddon,
    refreshAddons: fetchAddons
  };
}