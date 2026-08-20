'use server';

import { findUserByEmail, createUser } from '@/services/db/user.service';
import { z } from 'zod';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function registerUser(formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid input provided' };
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return { error: 'An account with this email already exists. Please sign in.' };
    }

    await createUser(email, password, name, 'USER');
    return { success: true };
  } catch (err) {
    console.error('[registerUser] error:', err);
    return { error: 'Failed to create account. Please try again.' };
  }
}
