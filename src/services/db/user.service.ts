import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { profile: true },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { profile: true },
  });
}

export async function createUser(email: string, password?: string, name?: string, role?: 'USER' | 'ADMIN') {
  const normalizedEmail = email.toLowerCase().trim();
  const isAdminEmail = normalizedEmail === 'sachinadmin.app' || normalizedEmail === 'sachinadmin@realityforecast.app';
  const assignedRole = role || (isAdminEmail ? 'ADMIN' : 'USER');
  const passwordHash = password ? await bcrypt.hash(password, 10) : null;

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      name: name || (assignedRole === 'ADMIN' ? 'System Admin' : 'Sachin'),
      role: assignedRole,
      profile: {
        create: {
          location: 'Delhi NCR, India',
          skills: 'TypeScript, Next.js, System Design, PostgreSQL',
          jobPreferences: 'Software Developer',
          transportPreferences: 'Car, Delhi Metro',
        },
      },
    },
    include: { profile: true },
  });
  return user;
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    bio?: string;
    location?: string;
    timezone?: string;
    skills?: string;
    jobPreferences?: string;
    transportPreferences?: string;
  }
) {
  const { name, ...profileData } = data;

  if (name) {
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    });
  }

  return prisma.profile.upsert({
    where: { userId },
    update: profileData,
    create: {
      userId,
      ...profileData,
    },
  });
}

export async function verifyUserCredentials(email: string, passwordAttempt: string) {
  const user = await findUserByEmail(email);
  if (!user || !user.passwordHash) return null;

  const isValid = await bcrypt.compare(passwordAttempt, user.passwordHash);
  if (!isValid) return null;

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return user;
}
