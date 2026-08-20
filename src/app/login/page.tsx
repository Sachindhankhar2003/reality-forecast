import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || '/dashboard';

  // If already authenticated, redirect away from login page
  if (session?.user) {
    redirect(callbackUrl);
  }

  let errorMsg = '';
  if (params.error === 'CredentialsSignin') {
    errorMsg = 'Invalid email or password. Please try again.';
  } else if (params.error) {
    errorMsg = 'Authentication error. Please try again.';
  }

  return <LoginForm callbackUrl={callbackUrl} initialError={errorMsg} />;
}
