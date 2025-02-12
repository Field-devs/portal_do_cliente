import { supabase } from './lib/supabase';

async function testAuth() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'gabriel.mauro@fieldcorp.com.br',
      password: '741129Dmv!'
    });

    if (error) {
      console.error('Authentication failed:', error.message);
      return false;
    }

    if (data.user) {
      console.log('Authentication successful!');
      return true;
    }

    return false;
  } catch (err) {
    console.error('Error during authentication:', err);
    return false;
  }
}

testAuth();