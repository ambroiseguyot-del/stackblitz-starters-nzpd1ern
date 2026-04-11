import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  try {
    const supabase = createMiddlewareClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    // Protection : si on va sur /app sans session -> direction /login
    if (!session && req.nextUrl.pathname.startsWith('/app')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  } catch (error) {
    // Si Supabase n'est pas encore prêt, on laisse passer pour éviter l'écran rouge
    console.error('Middleware auth error:', error);
  }

  return res;
}

export const config = {
  matcher: ['/app/:path*'],
};