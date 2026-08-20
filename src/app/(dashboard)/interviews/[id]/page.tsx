import { forecastStore } from '@/lib/forecast-store';
import { InterviewMockClient } from './InterviewMockClient';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InterviewDetailPage({ params }: Props) {
  const { id } = await params;
  const interview = forecastStore.getInterview(id);

  if (!interview) {
    notFound();
  }

  return <InterviewMockClient interview={interview} />;
}
