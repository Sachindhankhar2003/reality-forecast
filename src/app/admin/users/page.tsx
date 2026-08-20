import { prisma } from '@/lib/db';
import { AdminUsersClient } from '@/components/admin/AdminUsersClient';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      lastLoginAt: true,
      _count: {
        select: {
          forecasts: true,
          interviews: true,
          conversations: true,
          memories: true,
        },
      },
    },
  });

  return <AdminUsersClient initialUsers={users as any} />;
}
