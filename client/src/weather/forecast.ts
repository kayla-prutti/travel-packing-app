import type { Stop } from "../../component/place-and-date-page/place-and-date-page";

export type ForecastDay = {
  alert: boolean;
  date: Date;
  high: number;
  icon: WeatherIcon;
  low: number;
  precipitationMillimeters: number;
  weatherCode: number;
};

export type WeatherIcon =
  | "weather-cloudy"
  | "weather-fog"
  | "weather-lightning"
  | "weather-partly-cloudy"
  | "weather-pouring"
  | "weather-snowy"
  | "weather-sunny";

export type WeatherPackingItem = {
  detail: string;
  icon:
    | "snowflake"
    | "sunglasses"
    | "umbrella-outline"
    | "weather-pouring"
    | "weather-windy"
    | "water-outline";
  id: string;
  label: string;
};

export type TripForecast = {
  averageWindSpeed: number | null;
  currentTemperature: number | null;
  currentWeatherIcon: WeatherIcon;
  days: ForecastDay[];
  extrasCount: number;
  feelsLike: number | null;
  high: number | null;
  location: string;
  low: number | null;
  rainDays: number;
  suggestedPackingItems: WeatherPackingItem[];
  summary: string;
  uvLabel: string;
};

export type TripForecastResult =
  | { status: "available"; forecast: TripForecast }
  | { status: "too-far"; availableFrom: Date; maxForecastDate: Date }
  | { status: "error"; message: string };

type OpenMeteoForecastResponse = {
  current?: {
    apparent_temperature?: number;
    temperature_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
  daily?: {
    precipitation_sum?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    time?: string[];
    uv_index_max?: number[];
    weather_code?: number[];
    wind_speed_10m_max?: number[];
  };
};

const MAX_FORECAST_DAYS = 16;

function startOfDay(date: Date): Date {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function toApiDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function round(value: number | undefined | null): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  return Math.round(value);
}

function formatLocation(stop: Stop): string {
  if (stop.weatherLocationQuery) {
    return stop.weatherLocationQuery;
  }
  return stop.country ? `${stop.city}, ${stop.country}` : stop.city;
}

function getWeatherIcon(code: number | undefined): WeatherIcon {
  if (code === undefined) {
    return "weather-partly-cloudy";
  }
  if (code === 0) {
    return "weather-sunny";
  }
  if ([1, 2].includes(code)) {
    return "weather-partly-cloudy";
  }
  if (code === 3) {
    return "weather-cloudy";
  }
  if ([45, 48].includes(code)) {
    return "weather-fog";
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return "weather-pouring";
  }
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return "weather-snowy";
  }
  if (code >= 95) {
    return "weather-lightning";
  }
  return "weather-partly-cloudy";
}

function uvLabel(maxUv: number | null): string {
  if (maxUv === null) {
    return "N/A";
  }
  if (maxUv < 3) {
    return "Low";
  }
  if (maxUv < 6) {
    return "Moderate";
  }
  if (maxUv < 8) {
    return "High";
  }
  if (maxUv < 11) {
    return "Very high";
  }
  return "Extreme";
}

function buildSummary(
  rainDays: number,
  low: number | null,
  high: number | null
): string {
  const details: string[] = [];
  if (rainDays > 0) {
    details.push(`${rainDays} wet day${rainDays === 1 ? "" : "s"}`);
  }
  if (low !== null && low <= 5) {
    details.push("cold nights");
  }
  if (high !== null && high >= 28) {
    details.push("warm afternoons");
  }
  if (details.length === 0) {
    return "Conditions look fairly mild. We'll keep the packing list general.";
  }
  return `${details.join(
    " and "
  )} — we'll use this to suggest useful extras for your list.`;
}

function buildWeatherPackingItems({
  averageWindSpeed,
  high,
  low,
  maxUv,
  rainDays,
}: {
  averageWindSpeed: number | null;
  high: number | null;
  low: number | null;
  maxUv: number | null;
  rainDays: number;
}): WeatherPackingItem[] {
  const items: WeatherPackingItem[] = [];

  if (rainDays > 0) {
    items.push({
      detail: `Rain forecast on ${rainDays} day${rainDays === 1 ? "" : "s"}`,
      icon: "weather-pouring",
      id: "weather-rain-jacket",
      label: "Waterproof rain jacket",
    });
    items.push({
      detail: "Useful for wet walks or sudden showers",
      icon: "umbrella-outline",
      id: "weather-umbrella",
      label: "Compact umbrella",
    });
  }

  if (low !== null && low <= 5) {
    items.push({
      detail: `Lows near ${low}°`,
      icon: "snowflake",
      id: "weather-warm-layer",
      label: "Warm layer",
    });
  }

  if (high !== null && high >= 28) {
    items.push({
      detail: `Highs near ${high}°`,
      icon: "water-outline",
      id: "weather-extra-water",
      label: "Reusable water bottle",
    });
  }

  if (maxUv !== null && maxUv >= 6) {
    items.push({
      detail: `${uvLabel(maxUv)} UV expected`,
      icon: "sunglasses",
      id: "weather-sun-protection",
      label: "Sun protection",
    });
  }

  if (averageWindSpeed !== null && averageWindSpeed >= 30) {
    items.push({
      detail: `Wind around ${averageWindSpeed} km/h`,
      icon: "weather-windy",
      id: "weather-wind-layer",
      label: "Wind-resistant layer",
    });
  }

  return items;
}

export function getForecastAvailability(stop: Stop, today = new Date()) {
  const todayStart = startOfDay(today);
  const maxForecastDate = addDays(todayStart, MAX_FORECAST_DAYS - 1);
  return {
    available:
      startOfDay(stop.startDate) <= maxForecastDate &&
      startOfDay(stop.endDate) <= maxForecastDate,
    availableFrom: addDays(
      startOfDay(stop.startDate),
      -(MAX_FORECAST_DAYS - 1)
    ),
    maxForecastDate,
  };
}

export async function fetchTripForecast(
  stops: Stop[]
): Promise<TripForecastResult> {
  const stop = stops[0];
  if (!stop) {
    return { status: "error", message: "Choose a destination first." };
  }

  const availability = getForecastAvailability(stop);
  if (!availability.available) {
    return {
      status: "too-far",
      availableFrom: availability.availableFrom,
      maxForecastDate: availability.maxForecastDate,
    };
  }

  const params = new URLSearchParams({
    current: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max",
    end_date: toApiDate(stop.endDate),
    latitude: `${stop.latitude}`,
    longitude: `${stop.longitude}`,
    start_date: toApiDate(stop.startDate),
    timezone: "auto",
    wind_speed_unit: "kmh",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`
  );
  if (!response.ok) {
    return {
      status: "error",
      message: "Unable to load the forecast right now.",
    };
  }

  const data = (await response.json()) as OpenMeteoForecastResponse;
  const times = data.daily?.time ?? [];
  const highs = data.daily?.temperature_2m_max ?? [];
  const lows = data.daily?.temperature_2m_min ?? [];
  const precipitation = data.daily?.precipitation_sum ?? [];
  const weatherCodes = data.daily?.weather_code ?? [];
  const windSpeeds = data.daily?.wind_speed_10m_max ?? [];
  const uvIndexes = data.daily?.uv_index_max ?? [];

  const days = times.map<ForecastDay>((time, index) => {
    const precipitationMillimeters = precipitation[index] ?? 0;
    const weatherCode = weatherCodes[index] ?? 2;
    return {
      alert: precipitationMillimeters > 0 || weatherCode >= 51,
      date: new Date(`${time}T12:00:00`),
      high: Math.round(highs[index] ?? 0),
      icon: getWeatherIcon(weatherCode),
      low: Math.round(lows[index] ?? 0),
      precipitationMillimeters,
      weatherCode,
    };
  });

  const high = round(Math.max(...highs.filter(Number.isFinite)));
  const low = round(Math.min(...lows.filter(Number.isFinite)));
  const rainDays = days.filter(
    (day) => day.precipitationMillimeters > 0 || day.weatherCode >= 51
  ).length;
  const averageWindSpeed =
    windSpeeds.length > 0
      ? round(
          windSpeeds.reduce((total, speed) => total + speed, 0) /
            windSpeeds.length
        )
      : round(data.current?.wind_speed_10m);
  const maxUv = round(Math.max(...uvIndexes.filter(Number.isFinite)));
  const suggestedPackingItems = buildWeatherPackingItems({
    averageWindSpeed,
    high,
    low,
    maxUv,
    rainDays,
  });

  return {
    status: "available",
    forecast: {
      averageWindSpeed,
      currentTemperature: round(data.current?.temperature_2m),
      currentWeatherIcon: getWeatherIcon(data.current?.weather_code),
      days,
      extrasCount: suggestedPackingItems.length,
      feelsLike: round(data.current?.apparent_temperature),
      high,
      location: formatLocation(stop),
      low,
      rainDays,
      suggestedPackingItems,
      summary: buildSummary(rainDays, low, high),
      uvLabel: uvLabel(maxUv),
    },
  };
}
