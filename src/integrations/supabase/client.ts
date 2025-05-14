
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// Supabase credentials
const SUPABASE_URL = "https://pmhdeeiazpelwjwsikud.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtaGRlZWlhenBlbHdqd3Npa3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NjgyOTgsImV4cCI6MjA2MDU0NDI5OH0.5KDlAiFRqXd0BX1vV1JhtdQqBk_6Yr06hRjc9OMXuKM";

// Initialize the Supabase client with typed database interface and explicit auth configuration
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);
