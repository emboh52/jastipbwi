import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client with cookie-based auth.
 * Used in admin client components where the user is authenticated.
 *
 * For public/anon pages, use `lib/supabase/client.ts` instead.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
