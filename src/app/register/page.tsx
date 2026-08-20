import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Create Account — Future AI',
  description: 'Sign up for Future AI Reality Forecast',
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || '/dashboard';

  if (session?.user) {
    redirect(callbackUrl);
  }

  return <RegisterForm callbackUrl={callbackUrl} />;
}

