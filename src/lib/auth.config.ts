import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userEmail = auth?.user?.email?.toLowerCase() || '';
      const userRole = (auth?.user as { role?: string })?.role || (userEmail === 'sachinadmin.app' ? 'ADMIN' : 'USER');
      const pathname = nextUrl.pathname;

      const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
      const isAdminRoute = pathname.startsWith('/admin');
      const isPublicRoute =
        pathname.startsWith('/api/health') ||
        pathname.startsWith('/api/auth');

      if (isPublicRoute) {
        return true;
      }

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
      }

      if (pathname === '/') {
        if (isLoggedIn) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return Response.redirect(new URL('/login', nextUrl));
      }

      if (isAdminRoute) {
        if (!isLoggedIn) {
          return Response.redirect(new URL('/login', nextUrl));
        }
        if (userRole !== 'ADMIN') {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
      }

      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = (user as { role?: string }).role || (user.email?.toLowerCase() === 'sachinadmin.app' ? 'ADMIN' : 'USER');
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = (token.role as string) || 'USER';
      }
      return session;
    },
  },
  providers: [], // Configured in auth.ts
};
