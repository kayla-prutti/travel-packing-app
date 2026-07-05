export type TripType = "hiking" | "city" | "beach" | "camping" | "ski" | "business";

export const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: "city", label: "City" },
  { value: "beach", label: "Beach" },
  { value: "hiking", label: "Hiking" },
  { value: "camping", label: "Camping" },
  { value: "ski", label: "Ski / Snow" },
  { value: "business", label: "Business" },
];

export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  trip_types: TripType[];
  created_at: string;
}

export interface PackingItem {
  id: string;
  trip_id: string;
  name: string;
  category: string;
  is_checked: boolean;
  is_custom: boolean;
}

export interface ChecklistItem {
  id: string;
  trip_id: string;
  name: string;
  category: string | null;
  is_visited: boolean;
}

export interface DailyForecast {
  date: string;
  tempMaxC: number;
  tempMinC: number;
  precipitationMm: number;
  weatherCode: number;
}
