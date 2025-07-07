import { createClient } from '@supabase/supabase-js';

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // This should be set in your .env.local (never expose to client)
);

console.log('SERVICE ROLE KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);

export default supabaseService; 
