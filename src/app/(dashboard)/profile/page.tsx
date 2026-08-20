import { auth } from '@/lib/auth';
import { findUserById } from '@/services/db/user.service';
import { ProfileClient } from '@/components/profile/ProfileClient';

export default async function UserProfilePage() {
  const session = await auth();
  const userId = session?.user?.id || 'demo-dev-user';

  const dbUser = await findUserById(userId);

  const initialData = {
    name: dbUser?.name || 'Sachin',
    email: dbUser?.email || 'sachin@example.com',
    bio: dbUser?.profile?.bio || 'Senior Full Stack Software Engineer preparing for system design & tech interviews in Delhi NCR.',
    location: dbUser?.profile?.location || 'Delhi NCR, India',
    timezone: dbUser?.profile?.timezone || 'Asia/Kolkata (GMT+5:30)',
    skills: dbUser?.profile?.skills || 'TypeScript, Next.js, React, Node.js, System Design, PostgreSQL, Prisma',
    jobPreferences: dbUser?.profile?.jobPreferences || 'Senior Full Stack Developer / Software Engineer',
    transportPreferences: dbUser?.profile?.transportPreferences || 'Car (Primary), Delhi Metro (Secondary Fallback)',
  };

  return <ProfileClient initialData={initialData} />;
}
