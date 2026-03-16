import { createClient } from '@supabase/supabase-js';

// Fallback empty strings to avoid crashes if env is missing during build, 
// though they should be present in production.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
