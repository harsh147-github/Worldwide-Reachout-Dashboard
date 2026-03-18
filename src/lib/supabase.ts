import { createClient } from '@supabase/supabase-js';

// Client-side Supabase (for React components)
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server-side Supabase (for API routes / server actions)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

// Singleton for client components
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabase() {
  if (typeof window === 'undefined') return createServerClient();
  if (!browserClient) browserClient = createBrowserClient();
  return browserClient;
}
