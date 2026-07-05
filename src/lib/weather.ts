import type { DailyForecast } from "@/types";

export interface GeocodeResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export async function geocodeDestination(query: string): Promise<GeocodeResult | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=1&language=en&format=json`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  const first = data.results?.[0];
  if (!first) return null;

  return {
    name: first.name,
    latitude: first.latitude,
    longitude: first.longitude,
    country: first.country,
    admin1: first.admin1,
  };
}

// Open-Meteo forecast API only covers ~16 days ahead; trips further out won't
// have a forecast yet, so callers should handle an empty array gracefully.
export async function getForecast(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<DailyForecast[]> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode"
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);

  const res = await fetch(url.toString());
  if (!res.ok) return [];

  const data = await res.json();
  const daily = data.daily;
  if (!daily?.time) return [];

  return daily.time.map((date: string, i: number) => ({
    date,
    tempMaxC: daily.temperature_2m_max[i],
    tempMinC: daily.temperature_2m_min[i],
    precipitationMm: daily.precipitation_sum[i],
    weatherCode: daily.weathercode[i],
  }));
}

// https://open-meteo.com/en/docs weather code reference (WMO codes)
export function describeWeatherCode(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain showers";
  if (code <= 86) return "Snow showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}
