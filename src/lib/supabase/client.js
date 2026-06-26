import { browser } from '$app/environment';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

let client = null;

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey) && String(supabaseUrl).startsWith('http');

export const getSupabaseClient = () => {
  if (!browser || !isSupabaseConfigured) return null;
  if (client) return client;

  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return client;
};