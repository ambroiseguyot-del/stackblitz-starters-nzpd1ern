import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/app', '/analyse', '/previsions', '/recurrences'];
const isProtected = (pathname: string) =>
  protectedPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

export async function middleware(req: NextRequest) {
  if (!isProtected(req.nextUrl.pathname)) return NextResponse.next();
  let res = NextResponse.next({ request: { headers: req.headers } });
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
            res = NextResponse.next({ request: { headers: req.headers } });
            cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
          },
        },
      }
    );
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return NextResponse.redirect(new URL('/login', req.url));
    return res;
  } catch (error) {
    console.error('Private route authentication unavailable:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/app/:path*', '/analyse/:path*', '/previsions/:path*', '/recurrences/:path*'],
};
