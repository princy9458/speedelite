import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "./lib/auth-config";
import { verifySessionTokenEdge } from "./lib/auth-edge";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle locale routing
  const response = intlMiddleware(request);

  // 2. Handle admin auth
  // After intlMiddleware, the pathname might be prefixed with locale
  const isAdminPath = pathname.match(/^\/(en|hr)\/admin/);
  const isLoginPath = pathname.match(/^\/(en|hr)\/admin\/login/);

  if (isAdminPath && !isLoginPath) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySessionTokenEdge(token);

    if (!session) {
      const locale = pathname.split('/')[1] || 'en';
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all pathnames starting with a locale
    '/(hr|en)/:path*'
  ]
};
