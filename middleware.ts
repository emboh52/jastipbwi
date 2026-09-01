import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always refresh the session (even for /admin/login)
  const { supabase, user, response } = await updateSession(request);

  // Don't gate /admin/login
  if (pathname === '/admin/login') {
    return response;
  }

  // --- Require authentication for all other /admin/* routes ---

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  // --- Require admin_users row via is_admin() RPC ---

  const { data: isAdmin } = await supabase.rpc('is_admin');

  if (!isAdmin) {
    // Sign out: the signOut call updates cookies via setAll → supabaseResponse
    await supabase.auth.signOut();

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('error', 'not_admin');

    const redirect = NextResponse.redirect(loginUrl);

    // Transfer any auth cookies (from signOut) to the redirect response
    response.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie);
    });

    return redirect;
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
