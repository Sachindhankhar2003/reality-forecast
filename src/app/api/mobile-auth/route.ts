import { NextRequest, NextResponse } from 'next/server';
import { verifyUserCredentials, createUser, findUserByEmail } from '@/services/db/user.service';
import { z } from 'zod';
import { SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'fallback-secret-key-32-chars-min!!');

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid email or password format.' }, { status: 400 });
    }

    const { email, password } = parsed.data;
    let user = await verifyUserCredentials(email, password);

    // Auto-create user if not found (like web app does)
    if (!user) {
      const existing = await findUserByEmail(email);
      if (!existing) {
        user = await createUser(email, password, email.split('@')[0], 'USER');
      } else {
        return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
      }
    }

    // Create JWT token valid for 30 days
    const token = await new SignJWT({ id: user.id, email: user.email, name: user.name, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(SECRET);

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error('[mobile-auth] error:', err);
    return NextResponse.json({ success: false, error: 'Server error. Please try again.' }, { status: 500 });
  }
}
