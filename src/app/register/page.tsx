import { redirect } from 'next/navigation';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ? `?callbackUrl=${encodeURIComponent(params.callbackUrl)}` : '';
  redirect(`/login${callbackUrl}`);
}
