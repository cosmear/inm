import { createClient } from '@supabase/supabase-js';

// Fallback empty strings to avoid crashes if env is missing during build
// We also remove any quotes or spaces that some strict .env parsers (like Hostinger's) might mistakenly leave in the string
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/['"]/g, '').trim();
const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/['"]/g, '').trim();

// The service role key bypasses Row Level Security (RLS). 
// NEVER share this publicly or expose it to the client side.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
