import { forecastStore } from '@/lib/forecast-store';
import { ForecastDetailClient } from './ForecastDetailClient';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ForecastDetailPage({ params }: Props) {
  const { id } = await params;
  const forecast = forecastStore.getForecast(id);

  if (!forecast) {
    notFound();
  }

  return <ForecastDetailClient forecast={forecast} />;
}
