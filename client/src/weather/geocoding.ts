export type GeocodedLocation = {
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  name: string;
  query: string;
};

type OpenMeteoGeocodingResponse = {
  results?: {
    admin1?: string;
    country?: string;
    latitude: number;
    longitude: number;
    name: string;
  }[];
};

export async function geocodeLocation(query: string): Promise<GeocodedLocation | null> {
  const cleanedQuery = query.trim().replace(/\s+/g, " ");
  if (!cleanedQuery) {
    return null;
  }

  const params = new URLSearchParams({
    count: "1",
    format: "json",
    language: "en",
    name: cleanedQuery,
  });

  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
  if (!response.ok) {
    throw new Error("Unable to check that location right now.");
  }

  const data = (await response.json()) as OpenMeteoGeocodingResponse;
  const result = data.results?.[0];
  if (!result?.name || !result.country) {
    return null;
  }

  return {
    admin1: result.admin1,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
    name: result.name,
    query: cleanedQuery,
  };
}
