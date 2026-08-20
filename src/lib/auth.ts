import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';
import { verifyUserCredentials, findUserByEmail, createUser } from '@/services/db/user.service';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({
              email: z.string().email(),
              password: z.string().min(6),
            })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            return null;
          }

          const { email, password } = parsedCredentials.data;
          let user = await verifyUserCredentials(email, password);

          // Auto-provision user if not found
          if (!user) {
            const existing = await findUserByEmail(email);
            const isAdmin =
              email.toLowerCase() === 'sachinadmin.app' ||
              email.toLowerCase() === 'sachinadmin@realityforecast.app';
            if (!existing) {
              user = await createUser(
                email,
                password,
                isAdmin ? 'Sachin Admin' : 'Sachin',
                isAdmin ? 'ADMIN' : 'USER'
              );
            } else {
              const passwordHash = await bcrypt.hash(password, 10);
              await prisma.user.update({
                where: { id: existing.id },
                data: {
                  passwordHash,
                  ...(isAdmin ? { role: 'ADMIN' } : {}),
                  lastLoginAt: new Date(),
                },
              });
              user = existing;
            }
          }

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
            };
          }

          return null;
        } catch (error) {
          console.error('[auth] Credentials authorize error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      // For Google OAuth, auto-create user in DB if not exists
      if (account?.provider === 'google' && user.email) {
        try {
          const existing = await findUserByEmail(user.email);
          if (!existing) {
            await createUser(user.email, undefined, user.name || 'User', 'USER');
          } else {
            await prisma.user.update({
              where: { id: existing.id },
              data: { lastLoginAt: new Date() },
            });
          }
        } catch (error) {
          console.error('[auth] Google signIn DB error:', error);
        }
      }
      return true;
    },
  },
  session: { strategy: 'jwt' },
});
