import { createClient } from '@supabase/supabase-js';

// Fallback empty strings to avoid crashes if env is missing during build, 
// though they should be present in production. We ensure extra quotes mapped from .env files are removed.
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/['"]/g, '').trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/['"]/g, '').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
