import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string | null;
  role: 'USER' | 'ADMIN';
  status: string;
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const session = await auth();
  if (!session?.user?.id && !session?.user?.email) {
    return null;
  }

  const userId = session.user.id || 'demo-dev-user';
  const email = session.user.email || 'developer@delhi.future.app';

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ id: userId }, { email: email }],
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
    },
  });

  const isAdminEmail = email.toLowerCase() === 'sachinadmin.app' || email.toLowerCase() === 'sachinadmin@realityforecast.app';

  if (!user) {
    return {
      id: userId,
      email: email,
      name: session.user.name || (isAdminEmail ? 'Sachin Admin' : 'Sachin'),
      role: isAdminEmail ? 'ADMIN' : 'USER',
      status: 'ACTIVE',
    };
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: (user.role === 'ADMIN' ? 'ADMIN' : 'USER') as 'USER' | 'ADMIN',
    status: user.status,
  };
}

export async function requireAuth(): Promise<
  { user: AuthenticatedUser; error: null } | { user: null; error: NextResponse }
> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication is required.' } },
        { status: 401 }
      ),
    };
  }

  if (user.status === 'DISABLED') {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Your account has been disabled. Access denied.' } },
        { status: 403 }
      ),
    };
  }

  return { user, error: null };
}

export async function requireUser(): Promise<
  { user: AuthenticatedUser; error: null } | { user: null; error: NextResponse }
> {
  return await requireAuth();
}

export async function requireAdmin(): Promise<
  { user: AuthenticatedUser; error: null } | { user: null; error: NextResponse }
> {
  const authResult = await requireAuth();
  if (authResult.error) return authResult;

  if (authResult.user.role !== 'ADMIN') {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin role is required to access this resource.' } },
        { status: 403 }
      ),
    };
  }

  return { user: authResult.user, error: null };
}
