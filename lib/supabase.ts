import { createClient } from '@supabase/supabase-js';

// Queste variabili vengono iniettate da Vite durante il build
const supabaseUrl = process.env.SUPABASE_URL || 'https://jqgfsvdtbwedmoduykdb.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ2ZzdmR0YndlZG1vZHV5a2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDA0MzksImV4cCI6MjA4Njk3NjQzOX0.2BgSHLe_ZlNeKkE3rcjJv2WDkF-vZOQc9p_8Xs7dmME';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase configuration. Check environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};