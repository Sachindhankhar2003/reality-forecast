import { forecastStore } from '@/lib/forecast-store';
import { ForecastLibraryClient } from '@/components/forecast/ForecastLibraryClient';

export default async function ForecastHistoryPage() {
  const forecasts = forecastStore.getAllForecasts();
  return <ForecastLibraryClient initialForecasts={forecasts} />;
}
