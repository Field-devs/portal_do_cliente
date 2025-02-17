import { supabase } from './lib/supabase';

async function testConnection() {
  try {
    // Test basic query
    const { data, error } = await supabase
      .from('pessoas')
      .select('count(*)', { count: 'exact' });

    if (error) {
      console.error('Connection error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error testing connection:', err);
    return false;
  }
}

testConnection();